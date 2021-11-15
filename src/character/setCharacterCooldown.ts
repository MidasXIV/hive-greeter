import { Character } from "./Character";
import { getCharacter } from "./getCharacter";
import { updateCharacter } from "./updateCharacter";

export const setCharacterCooldown = (
  characterId: string,
  type: keyof Character["cooldowns"]
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return;
  const updatedCharacter = {
    ...character,
    cooldowns: { ...character.cooldowns, [type]: new Date().toString() },
  };
  updateCharacter(updatedCharacter);
  return getCharacter(characterId);
};
