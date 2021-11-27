import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { defaultProfile, defaultProfileAttachment } from "../gameState";
import { getUserCharacter } from "../character/getUserCharacter";
import { characterEmbed } from "../character/characterEmbed";
import { questEmbed } from "./questEmbed";
import { statusEffectEmbed } from "../statusEffects/statusEffectEmbed";
import { actionEmbed } from "./actionEmbed";
import { values } from "remeda";
import { statsEmbed } from "./statsEmbed";
import { itemEmbed } from "../equipment/itemEmbed";

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
  const shouldShowExtendedInfo =
    0 <
    values(character.equipment).length +
      (character.statusEffects?.length ?? 0) +
      values(character.quests).length;

  if (shouldShowExtendedInfo)
    await interaction[responseType]({
      embeds: values(character.equipment)
        .map((item) => itemEmbed({ item, interaction }))
        .concat(
          character.statusEffects?.map((effect) =>
            statusEffectEmbed(effect, interaction)
          ) ?? []
        )
        .concat(
          character.statusEffects?.map((effect) =>
            statusEffectEmbed(effect, interaction)
          ) ?? []
        )
        .concat(questEmbed(character) ?? []),
    });
  await interaction[shouldShowExtendedInfo ? "followUp" : responseType]({
    attachments:
      character.profile === defaultProfile ? [defaultProfileAttachment] : [],
    embeds: [
      characterEmbed({ character, interaction }),
      statsEmbed({ character, interaction }),
      actionEmbed({ character, interaction }),
    ],
  });
};

export default { command, execute };
