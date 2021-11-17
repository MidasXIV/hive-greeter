import { GuildEmoji, Interaction } from "discord.js";

export function getEmoji(interaction: Interaction, emoji: Emoji);

export function getXPEmoji(interaction: Interaction): GuildEmoji | void {
  return interaction.guild?.emojis.cache.find((emoji) => emoji.name === "xp");
}
