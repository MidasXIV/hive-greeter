import { Character } from "../character/Character";
import { getCharacterStatModified } from "../character/getCharacterStatModified";
import { clamp, times } from "remeda";
import { getCharacter } from "../gameState";

export const hpBar = (c: Character, adjustment = 0): string => {
  const barLength = 10;
  const character = getCharacter(c.id);
  if (!character) return "";

  const maxHP = getCharacterStatModified(character, "maxHP");
  const fullPercent = character.hp / maxHP;
  const adjustPercent = adjustment / maxHP;

  const full = Math.ceil(fullPercent * barLength);

  const damage = clamp(Math.floor(-adjustPercent * barLength), {
    max: maxHP,
    min: 0,
  });
  const heal = Math.max(0, Math.floor(adjustPercent * barLength));
  const empty = barLength - full - damage - heal;
  console.log("hpBar", { full, damage, heal, empty });
  try {
    return (
      repeat("💚", full) +
      repeat("💔", damage) +
      repeat("🤍", heal) +
      repeat("🖤", empty)
    );
  } catch (e) {
    console.error("hp bar failed", e);
    return `hp bar failed ${e}`;
  }
};

const repeat = (str: string, num: number) => times(num, () => str).join("");
