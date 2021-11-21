import { Interaction } from "discord.js";

type Emojis = "xp" | "gold" | "damage" | "heal";

const defaultEmojis: {
  [k in Emojis]: string;
} = {
  xp: "🧠",
  gold: "💰",
  damage: "💔",
  heal: "🤍",
};

/**
 * Use a guild's emojis, or fallback to defaults
 */
export function Emoji(interaction: Interaction, name: Emojis): string {
  return `${
    interaction.guild?.emojis.cache.find((emoji) => emoji.name === name) ??
    defaultEmojis[name] ??
    "❓"
  }`;
}
