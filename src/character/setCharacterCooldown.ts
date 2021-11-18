import { Character } from "./Character";
import { getCharacter } from "./getCharacter";
import store from '../store'
import { updateCharacterCooldowns } from "../store/slices/characters";

export const setCharacterCooldown = (
  characterId: string,
  type: keyof Character["cooldowns"]
): Character | void => {
  const character = getCharacter(characterId);
  if (!character) return;
  store.dispatch(updateCharacterCooldowns({ 
    character,
    cooldowns: { ...character.cooldowns, [type]: new Date().toString() },
  }))
  return getCharacter(characterId);
};
