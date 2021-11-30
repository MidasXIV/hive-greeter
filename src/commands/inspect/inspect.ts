import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, TextChannel } from "discord.js";
import { defaultProfile, defaultProfileAttachment } from "../../gameState";
import { getUserCharacter } from "../../character/getUserCharacter";
import { characterEmbed } from "../../character/characterEmbed";
import { questEmbed } from "../questEmbed";
import { statusEffectEmbed } from "../../statusEffects/statusEffectEmbed";
import { actionEmbed } from "./actionEmbed";
import { values } from "remeda";
import { statsEmbed } from "../statsEmbed";
import { itemEmbed } from "../../equipment/itemEmbed";

export const command = new SlashCommandBuilder()
  .setName("inspect")
  .setDescription("Inspect someone.")
  .addUserOption((option) =>
    option.setName("target").setDescription("Whom to inspect")
  );

// TODO: inspect hp|stats|inventory|cooldowns
export const execute = async (
  interaction: CommandInteraction,
  responseType: "followUp" | "reply" = "reply"
): Promise<void> => {
  const user =
    (interaction.options.data[0] && interaction.options.data[0].user) ||
    interaction.user;
  const character = getUserCharacter(user);
  console.log(`inspect ${character.name}`, character);

  await interaction[responseType]({
    attachments:
      character.profile === defaultProfile ? [defaultProfileAttachment] : [],
    embeds: [
      characterEmbed({ character, interaction }),
      statsEmbed({ character, interaction }),
      actionEmbed({ character, interaction }),
    ],
  });

  const channel = interaction.channel;
  if (!(channel instanceof TextChannel)) return;
  const thread = await channel.threads.create({
    name: `Inspect ${character.name}`,
  });
  const webhooks = await channel.fetchWebhooks();
  const hook = webhooks.first() ?? (await channel.createWebhook("Inspect"));
  if (!hook) return;

  const equipmentEmbeds = values(character.equipment)
    .map((item) => itemEmbed({ item, interaction }))
    .slice(0, 9);
  if (equipmentEmbeds.length) {
    await hook.edit({
      name: "Equipment",
      avatar:
        "https://www.wallpaperup.com/uploads/wallpapers/2013/02/22/43066/33ee1c3920aa37d0b18a0de6cd9796b9.jpg",
    });
    await hook.send({
      embeds: equipmentEmbeds,
      threadId: thread.id,
    });
  }

  if ((character.statusEffects?.length ?? 0) > 0) {
    await hook.edit({
      name: "Status Effects",
      avatar:
        "https://www.wallpaperup.com/uploads/wallpapers/2013/02/22/43066/33ee1c3920aa37d0b18a0de6cd9796b9.jpg",
    });
    await hook.send({
      embeds: character.statusEffects?.map((effect) =>
        statusEffectEmbed(effect, interaction)
      ),
      threadId: thread.id,
    });
  }
  const embed = questEmbed(character);
  if (embed) {
    await hook.edit({
      name: "Quests",
      avatar:
        "https://www.wallpaperup.com/uploads/wallpapers/2013/02/22/43066/33ee1c3920aa37d0b18a0de6cd9796b9.jpg",
    });
    await hook.send({ embeds: [embed], threadId: thread.id });
  }
  thread.setArchived(true);
};

export default { command, execute };
