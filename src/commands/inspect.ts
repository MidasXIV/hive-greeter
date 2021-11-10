import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  EmbedFieldData,
  Emoji,
  MessageEmbed,
} from "discord.js";
import moment from "moment";
import { Character } from "../character/Character";
import {
  defaultProfile,
  defaultProfileAttachment,
  getUserCharacter,
} from "../gameState";
import { getCharacterStatModifier } from "../character/getCharacterStatModifier";
import { getCharacterStatModified } from "../character/getCharacterStatModified";
import { cooldownRemainingText } from "../utils";
import { hpBar } from "../utils/hp-bar";
import { Stat } from "../character/Stats";

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
    embeds: [characterEmbed(character, xpEmoji)],
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
      ...actionFields(character),
    ]);
  if (Object.keys(character.equipment).length)
    embed.addField("**Equipment**", "───────────");
  Object.entries(character.equipment).forEach(([type, item]) => {
    embed.addField(type, item.name, true);
  });
  if (character.statusEffects?.length)
    embed.addField("**Status Effects**", "───────────");
  character.statusEffects?.forEach((effect) =>
    embed.addField(
      effect.name,
      `Expires ${moment(new Date(effect.started))
        .add(effect.duration)
        .fromNow()}`,
      true
    )
  );
  return embed;
};

export const hpBarField = (character: Character): EmbedFieldData => ({
  name: "HP",
  value: `${character.hp}/${getCharacterStatModified(
    character,
    "maxHP"
  )}\n${hpBar(character)}`,
});

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

const actionFields = (character: Character) => [
  {
    name: "**Actions Available**",
    value: `───────────`,
  },
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
];

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
