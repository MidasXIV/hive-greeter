import { Interaction } from "discord.js";

type Emojis =
  | "xp"
  | "gold"
  | "damage"
  | "heal"
  | "attack"
  | "ac"
  | "attackBonus"
  | "damageMax"
  | "damageBonus"
  | "maxHP";

const defaultEmojis: {
  [k in Emojis]: string;
} = {
  xp: "🧠",
  gold: "💰",
  damage: "💔",
  heal: "🤍",
  attack: "⚔",
  ac: "🛡",
  attackBonus: "⚔",
  damageBonus: "🩸",
  maxHP: "♥",
  damageMax: "🩸",
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
