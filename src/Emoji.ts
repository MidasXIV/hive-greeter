import { Interaction } from "discord.js";
import { Stat } from "./character/Stats";

type Emojis =
  | Stat
  | "xp"
  | "gold"
  | "damage"
  | "heal"
  | "attack"
  | "hit"
  | "miss"
  | "run"
  | "adventure";

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
  damageBonus: "💔",
  maxHP: "♥",
  damageMax: "💔",
  monsterDamageMax: "👹",
  hit: "💥",
  miss: "🛡",
  run: "🏃‍♀️",
  adventure: "🚶‍♀️",
};

/**
 * Use a guild's emojis, or fallback to defaults
 */
export function Emoji(interaction: Interaction, name: Emojis): string {
  return `${
    interaction.guild?.emojis.cache.find((emoji) => emoji.name === name) ??
    defaultEmojis[name]
  }`;
}
