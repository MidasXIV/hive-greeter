import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ChannelWebhookCreateOptions,
  Collection,
  CommandInteraction,
  TextChannel,
  Webhook,
} from "discord.js";
import { defaultProfile, defaultProfileAttachment } from "../../fixtures";
import { getUserCharacter } from "../../character/getUserCharacter";
import { characterEmbed } from "../../character/characterEmbed";
import { questEmbed } from "../questEmbed";
import { statusEffectEmbed } from "../../statusEffects/statusEffectEmbed";
import { actionEmbed } from "./actionEmbed";
import { values } from "remeda";
import { statsEmbed } from "../../character/statsEmbed";
import { itemEmbed } from "../../equipment/itemEmbed";
import { Character } from "../../character/Character";

export const command = new SlashCommandBuilder()
  .setName("inspect")
  .setDescription("Inspect someone.")
  .addUserOption((option) =>
    option.setName("target").setDescription("Whom to inspect")
  );

// TODO: inspect hp|stats|inventory|cooldowns
export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const user =
    (interaction.options.data[0] && interaction.options.data[0].user) ||
    interaction.user;
  const character = getUserCharacter(user);
  console.log(`inspect ${character.name}`, character);

  await interaction.followUp({
    attachments:
      character.profile === defaultProfile ? [defaultProfileAttachment] : [],
    embeds: [
      characterEmbed({ character, interaction }),
      statsEmbed({ character, interaction }),
      actionEmbed({ character, interaction }),
    ],
  });

  if (
    values(character.equipment).length ||
    (character.statusEffects?.length ?? 0) ||
    values(character.quests).length
  )
    inspectThread({ interaction, character });
};

type HookName = "Equipment" | "Status Effects" | "Quests";

async function getHook({
  name,
  interaction,
  webhooks,
}: {
  name: HookName;
  interaction: CommandInteraction;
  webhooks: Collection<string, Webhook>;
}) {
  const channel = interaction.channel;
  if (!(channel instanceof TextChannel)) return;
  const existingHook = webhooks.find((hook) => hook.name === name);
  if (existingHook) return existingHook;
  return await channel.createWebhook(name, hookOptions(name));
}

function hookOptions(name: HookName): ChannelWebhookCreateOptions {
  return {
    avatar:
      "https://www.wallpaperup.com/uploads/wallpapers/2013/02/22/43066/33ee1c3920aa37d0b18a0de6cd9796b9.jpg",
    reason: name,
  };
}

async function inspectThread({
  interaction,
  character,
}: {
  interaction: CommandInteraction;
  character: Character;
}): Promise<void> {
  const channel = interaction.channel;
  if (!(channel instanceof TextChannel)) return;
  const thread = await channel.threads.create({
    name: `Inspect ${character.name}`,
  });
  const webhooks = await channel.fetchWebhooks();
  const equipmentEmbeds = values(character.equipment)
    .map((item) => itemEmbed({ item, interaction }))
    .slice(0, 9);
  if (equipmentEmbeds.length)
    await getHook({
      name: "Equipment",
      webhooks,
      interaction,
    }).then((hook) => {
      hook?.send({
        embeds: equipmentEmbeds,
        threadId: thread.id,
      });
    });

  if ((character.statusEffects?.length ?? 0) > 0) {
    await getHook({
      name: "Status Effects",
      webhooks,
      interaction,
    }).then((hook) =>
      hook?.send({
        embeds: character.statusEffects?.map((effect) =>
          statusEffectEmbed(effect, interaction)
        ),
        threadId: thread.id,
      })
    );
  }
  const embed = questEmbed(character);
  if (embed) {
    await getHook({
      name: "Quests",
      webhooks,
      interaction,
    }).then((hook) =>
      hook?.send({
        embeds: [embed],
        threadId: thread.id,
      })
    );
  }
  thread.setArchived(true);
}

export default { command, execute };
