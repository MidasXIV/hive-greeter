import { Character } from "../character/Character";
import { getCharacterStatModified } from "../character/getCharacterStatModified";

export const hpBar = (character: Character, adjustment = 0): string => {
  const hp = Math.ceil(
    (character.hp / getCharacterStatModified(character, "maxHP")) * 10
  );
  const dmg =
    adjustment < 0
      ? Math.floor(
          (-adjustment / getCharacterStatModified(character, "maxHP")) * 10
        )
      : 0;
  const heal =
    adjustment > 0
      ? Math.floor(
          (adjustment / getCharacterStatModified(character, "maxHP")) * 10
        )
      : 0;
  try {
    return (
      Array.from(Array(hp - heal))
        .map(() => "💚")
        .join("") +
      Array.from(Array(heal))
        .map(() => "🤍")
        .join("") +
      Array.from(Array(dmg))
        .map(() => "💔")
        .join("") +
      Array.from(Array(10 - hp - dmg))
        .map(() => "🖤")
        .join("")
    );
  } catch (e) {
    console.error(e);
    return "hpBar Error";
  }
};
