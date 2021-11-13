import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  EmbedFieldData,
  Emoji,
  MessageEmbed,
} from "discord.js";
import { Character } from "../character/Character";
import { defaultProfile, defaultProfileAttachment } from "../gameState";
import { getUserCharacter } from "../getUserCharacter";
import { getCharacterStatModifier } from "../character/getCharacterStatModifier";
import { getCharacterStatModified } from "../character/getCharacterStatModified";
import { cooldownRemainingText } from "../utils";
import { hpBar } from "../character/hpBar/hpBar";
import { Stat } from "../character/Stats";
import { questProgressField } from "../quest/questProgressField";
import { itemEmbed } from "../equipment/equipment";
import { StatusEffect } from "../statusEffects/StatusEffect";

export const command = new SlashCommandBuilder()
  .setName("inspect")
  .setDescription("Inspect someone.")
  .addUserOption((option) =>
    option.setName("target").setDescription("Whom to inspect")
  );

export const execute = async (
  interaction: CommandInteraction,
  responseType: "followUp" | "reply" = "reply"
): Promise<void> => {
  const user =
    (interaction.options.data[0] && interaction.options.data[0].user) ||
    interaction.user;
  const character = getUserCharacter(user);
  const xpEmoji = interaction.guild?.emojis.cache.find(
    (emoji) => emoji.name === "xp"
  );
  await interaction[responseType]({
    attachments:
      character.profile === defaultProfile ? [defaultProfileAttachment] : [],
    embeds: [
      characterEmbed(character, xpEmoji),
      statEmbed(character),
      actionEmbed(character),
    ]
      .concat(Object.values(character.equipment).map(itemEmbed))
      .concat(character.statusEffects?.map(statusEffectEmbed) ?? [])
      .concat(questEmbed(character) ?? []),
    fetchReply: true,
  });
};

export default { command, execute };

export const statText = (character: Character, stat: Stat): string => {
  const modified = getCharacterStatModified(character, stat);
  const modifier = getCharacterStatModifier(character, stat);
  const sign = modifier > 0 ? "+" : "";
  return `${modified}${modifier ? ` (${sign}${modifier})` : ""}`;
};

export const characterEmbed = (
  character: Character,
  xpEmoji?: Emoji
): MessageEmbed => {
  const embed = new MessageEmbed()
    .setTitle(character.name)
    .setImage(character.profile)
    .addFields([
      ...primaryStatFields(character, xpEmoji),
      ...statFields(character),
    ]);
  return embed;
};

const questEmbed = (character: Character) => {
  if (Object.keys(character.quests).length === 0) return;
  const embed = new MessageEmbed();
  embed.setTitle("Quests");
  Object.values(character.quests).forEach((quest) => {
    embed.addFields([questProgressField(quest)]);
  });
  return embed;
};

export const primaryStatFields = (
  character: Character,
  xpEmoji?: Emoji
): EmbedFieldData[] => [
  {
    name: "HP",
    value: `${character.hp}/${getCharacterStatModified(
      character,
      "maxHP"
    )}\n${hpBar(character)}`,
  },
  {
    name: "XP",
    value: (xpEmoji?.toString() ?? "🧠") + " " + character.xp.toString(),
    inline: true,
  },
  {
    name: "GP",
    value: "💰 " + character.gold.toString(),
    inline: true,
  },
];

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

export const statFields = (character: Character) => [
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

function statusEffectEmbed(effect: StatusEffect) {
  return new MessageEmbed({
    title: effect.name,
    fields: Object.entries(effect.modifiers).map(([name, value]) => ({
      name,
      value: value.toString(),
    })),
    timestamp: new Date(new Date(effect.started).valueOf() + effect.duration),
  });
}
