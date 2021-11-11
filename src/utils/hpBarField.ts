import { Character } from "../character/Character";

export const hpBar = (character: Character, adjustment = 0): string => {
  const hp = Math.ceil((character.hp / character.maxHP) * 10);
  const dmg =
    adjustment < 0 ? Math.floor((-adjustment / character.maxHP) * 10) : 0;
  const heal =
    adjustment > 0 ? Math.floor((adjustment / character.maxHP) * 10) : 0;
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
