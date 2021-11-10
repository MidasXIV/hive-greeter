import { Character } from "../character/Character";
import { getCharacterStatModified } from "../character/getCharacterStatModified";

export const hpBar = (character: Character, adjustment = 0): string => {
  const barLength = 10;

  const maxHP = getCharacterStatModified(character, "maxHP");
  const fullPercent = character.hp / maxHP;
  const emptyPercent = maxHP - character.hp / maxHP;
  const adjustPercent = adjustment / maxHP;

  const full = Math.ceil(fullPercent * barLength);
  const empty = Math.floor(emptyPercent * barLength);
  const damage = adjustPercent > 0 ? 0 : Math.floor(adjustPercent * barLength);
  const heal = adjustPercent < 0 ? 0 : Math.floor(adjustPercent * barLength);

  // const hpPercent = character.hp / maxHP;
  // const adjustmentPercent = character.hp / adjustment;

  // const full = Math.ceil((character.hp / maxHP) * barLength);
  // const damage =
  //   adjustment < 0 ? Math.floor((-adjustment / maxHP) * barLength) : 0;
  // const heal =
  //   adjustment > 0 ? Math.floor((adjustment / maxHP) * barLength) : 0;
  // const empty = barLength - full - damage - heal;
  // if (full + damage + heal + empty > barLength) {
  //   debugger;
  // }
  console.log(character.name, {
    maxHP,
    hp: character.hp,
    full,
    damage,
    heal,
  });

  try {
    return (
      repeat("💚", full) +
      repeat("🤍", heal) +
      repeat("💔", damage) +
      repeat("🖤", empty)
    );
  } catch (e) {
    console.error(e);
    // debugger;
    return `hpBar Error: ${e}`;
  }
};

const repeat = (str: string, num: number) =>
  Array.from(Array(num))
    .map(() => str)
    .join("");
