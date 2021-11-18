import { Character } from "@adventure-bot/character/Character";
import { getCharacter } from "@adventure-bot/character/getCharacter";
import { getCharacterStatModified } from "@adventure-bot/character/getCharacterStatModified";
import { updateCharacter } from "@adventure-bot/character/updateCharacter";

export const adjustHP = (
  characterId: string,
  amount: number
): Character | void => {
  console.log("adjustHP", characterId, amount);
  const character = getCharacter(characterId);
  if (!character) {
    console.error(`adjustHP could not find characterId: ${characterId}`);
    return;
  }
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
  console.log("adjustCharacterHP", character.name, newHp);
  return {
    ...character,
    hp: newHp,
  };
};
