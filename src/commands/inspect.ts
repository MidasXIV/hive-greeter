import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Character } from "../character/Character";
import { defaultProfile, defaultProfileAttachment } from "../gameState";
import { getUserCharacter } from "../character/getUserCharacter";
import { getCharacterStatModifier } from "../character/getCharacterStatModifier";
import { getCharacterStatModified } from "../character/getCharacterStatModified";
import { Stat } from "../character/Stats";
import { itemEmbed } from "../equipment/equipment";
import { characterEmbed } from "../character/characterEmbed";
import { questEmbed } from "./questEmbed";
import { statusEffectEmbed } from "../statusEffects/statusEffectEmbed";
import { actionEmbed } from "./actionEmbed";
import { Emoji } from "../Emoji";
import { values } from "remeda";

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
        .map(itemEmbed)
        .concat(character.statusEffects?.map(statusEffectEmbed) ?? [])
        .concat(questEmbed(character) ?? []),
    });
  await interaction[shouldShowExtendedInfo ? "followUp" : responseType]({
    attachments:
      character.profile === defaultProfile ? [defaultProfileAttachment] : [],
    embeds: [
      characterEmbed({ character, interaction }),
      statEmbed({ character, interaction }),
      actionEmbed({ character, interaction }),
    ],
  });
};

export default { command, execute };

function statText({
  character,
  stat,
  interaction,
}: {
  character: Character;
  stat: Stat;
  interaction: CommandInteraction;
}): string {
  const modified = getCharacterStatModified(character, stat);
  const modifier = getCharacterStatModifier(character, stat);
  const sign = modifier > 0 ? "+" : "";
  return (
    Emoji(interaction, stat) +
    ` ${modified}${modifier ? ` (${sign}${modifier})` : ""}`
  );
}

export const statFields = (
  character: Character,
  interaction: CommandInteraction
): { name: string; value: string; inline?: boolean }[] => [
  {
    name: "**Stats**",
    value: `───────────`,
  },
  {
    name: "Armor",
    value: statText({ character, stat: "ac", interaction }),
    inline: true,
  },
  {
    name: "Attack Bonus",
    value: statText({ character, stat: "attackBonus", interaction }),
    inline: true,
  },
  {
    name: "Damage Max",
    value: statText({ character, stat: "damageMax", interaction }),
    inline: true,
  },
  {
    name: "Damage Bonus",
    value: statText({ character, stat: "damageBonus", interaction }),
    inline: true,
  },
  {
    name: "Max Health",
    value: statText({ character, stat: "maxHP", interaction }),
    inline: true,
  },
];

function statEmbed({
  character,
  interaction,
}: {
  character: Character;
  interaction: CommandInteraction;
}): MessageEmbed {
  return new MessageEmbed({
    title: `Stats`,
    fields: [
      {
        name: "Armor",
        value: statText({ character, stat: "ac", interaction }),
        inline: true,
      },
      {
        name: "Attack",
        value: statText({ character, stat: "attackBonus", interaction }),
        inline: true,
      },
      {
        name: "Damage Max",
        value: statText({ character, stat: "damageMax", interaction }),
        inline: true,
      },
      {
        name: "Damage Bonus",
        value: statText({ character, stat: "damageBonus", interaction }),
        inline: true,
      },
    ],
  });
}
