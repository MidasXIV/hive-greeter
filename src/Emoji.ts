import { Interaction } from "discord.js";

type Emojis = "xp" | "gold" | "damage";

const defaultEmojis: {
  [k in Emojis]: string;
} = {
  xp: "🧠",
  gold: "💰",
  damage: "💔",
};

export function Emoji(interaction: Interaction, name: Emojis): string {
  return `${
    interaction.guild?.emojis.cache.find((emoji) => emoji.name === name) ??
    defaultEmojis[name] ??
    "❓"
  }`;
}
