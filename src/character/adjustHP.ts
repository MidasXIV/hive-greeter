import { Character } from "./Character";
import { getCharacter } from "./getCharacter";
import { getCharacterStatModified } from "./getCharacterStatModified";
import { updateCharacter } from "./updateCharacter";

export const adjustHP = (
  characterId: string,
  amount: number
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return;
  updateCharacter(adjustCharacterHP(character, amount));
  return getCharacter(characterId);
};
export const adjustCharacterHP = (
  character: Character,
  amount: number
): Character => {
  const maxHP = getCharacterStatModified(character, "maxHP");
  let newHp = character.hp + amount;
  if (newHp < 0) newHp = 0;
  if (newHp > maxHP) newHp = maxHP;
  return {
    ...character,
    hp: newHp,
  };
};
