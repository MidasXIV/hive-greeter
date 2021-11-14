import { GuildEmoji, Interaction } from "discord.js";

export function getXPEmoji(interaction: Interaction): GuildEmoji | void {
  return interaction.guild?.emojis.cache.find((emoji) => emoji.name === "xp");
}
