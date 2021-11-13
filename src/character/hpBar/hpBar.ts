import { Character } from "../Character";
import { getCharacterStatModified } from "../getCharacterStatModified";
import { clamp, times } from "remeda";
import { getCharacter } from "../getCharacter";

export const hpBar = (c: Character, adjustment = 0): string => {
  const barLength = 10;
  const character = getCharacter(c.id);
  if (!character) return "";

  const maxHP = getCharacterStatModified(character, "maxHP");
  const fullPercent = character.hp / maxHP;
  const adjustPercent = adjustment / maxHP;

  const damage = clamp(Math.floor(-adjustPercent * barLength), {
    max: maxHP,
    min: 0,
  });

  const heal = clamp(Math.floor(adjustPercent * barLength), {
    max: maxHP,
    min: 0,
  });

  const full = Math.ceil(fullPercent * barLength) - heal;

  const empty = clamp(barLength - full - damage - heal, {
    max: maxHP,
    min: 0,
  });

  console.log("hpBar", { full, damage, heal, empty });
  if (full < 0) return `full ${full}`;
  if (damage < 0) return `damage ${damage}`;
  if (heal < 0) return `heal ${heal}`;
  if (empty < 0) return `empty ${empty}`;
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
