import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed } from "discord.js";
import { Character } from "../character/Character";
import { defaultProfile, defaultProfileAttachment } from "../gameState";
import { getUserCharacter } from "../character/getUserCharacter";
import { getCharacterStatModifier } from "../character/getCharacterStatModifier";
import { getCharacterStatModified } from "../character/getCharacterStatModified";
import { cooldownRemainingText } from "../utils";
import { Stat } from "../character/Stats";
import { itemEmbed } from "../equipment/equipment";
import { characterEmbed } from "../character/characterEmbed";
import { questEmbed } from "./questEmbed";
import { statusEffectEmbed } from "../statusEffects/statusEffectEmbed";

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
  const xpEmoji = getXPEmoji(interaction);
  const extendedInfo =
    0 <
    Object.values(character.equipment).length +
      (character.statusEffects?.length ?? 0) +
      Object.values(character.quests).length;

  if (extendedInfo)
    await interaction[responseType]({
      embeds: Object.values(character.equipment)
        .map(itemEmbed)
        .concat(character.statusEffects?.map(statusEffectEmbed) ?? [])
        .concat(questEmbed(character) ?? []),
    });
  await interaction[extendedInfo ? "followUp" : responseType]({
    attachments:
      character.profile === defaultProfile ? [defaultProfileAttachment] : [],
    embeds: [
      characterEmbed(character, xpEmoji),
      statEmbed(character),
      actionEmbed(character),
    ],
  });
};

export default { command, execute };

export const statText = (character: Character, stat: Stat): string => {
  const modified = getCharacterStatModified(character, stat);
  const modifier = getCharacterStatModifier(character, stat);
  const sign = modifier > 0 ? "+" : "";
  return `${modified}${modifier ? ` (${sign}${modifier})` : ""}`;
};

function getXPEmoji(interaction: CommandInteraction<CacheType>) {
  return interaction.guild?.emojis.cache.find((emoji) => emoji.name === "xp");
}

const actionEmbed = (character: Character) =>
  new MessageEmbed({
    title: "Actions",
    fields: [
      {
        name: "Attack",
        value: "⚔ " + cooldownRemainingText(character.id, "attack"),
        inline: true,
      },
      {
        name: "Adventure",
        value: "🚶‍♀️ " + cooldownRemainingText(character.id, "adventure"),
        inline: true,
      },
      {
        name: "Heal",
        value: "🤍 " + cooldownRemainingText(character.id, "adventure"),
        inline: true,
      },
    ],
  });

export const statFields = (
  character: Character
): { name: string; value: string; inline?: boolean }[] => [
  {
    name: "**Stats**",
    value: `───────────`,
  },
  {
    name: "AC",
    value: `🛡 ${statText(character, "ac")}`,
    inline: true,
  },
  {
    name: "Attack Bonus",
    value: `⚔ ${statText(character, "attackBonus")}`,
    inline: true,
  },
  {
    name: "Damage Max",
    value: `🩸 ${statText(character, "damageMax")}`,
    inline: true,
  },
  {
    name: "Damage Bonus",
    value: `🩸 ${statText(character, "damageBonus")}`,
    inline: true,
  },
  {
    name: "Max HP",
    value: `🩸 ${statText(character, "maxHP")}`,
    inline: true,
  },
];
export const statEmbed = (character: Character): MessageEmbed =>
  new MessageEmbed({
    title: `Stats`,
    fields: [
      {
        name: "AC",
        value: `🛡 ${statText(character, "ac")}`,
        inline: true,
      },
      {
        name: "Attack Bonus",
        value: `⚔ ${statText(character, "attackBonus")}`,
        inline: true,
      },
      {
        name: "Damage Max",
        value: `🩸 ${statText(character, "damageMax")}`,
        inline: true,
      },
      {
        name: "Damage Bonus",
        value: `🩸 ${statText(character, "damageBonus")}`,
        inline: true,
      },
    ],
  });
