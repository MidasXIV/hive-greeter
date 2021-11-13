import { gameState } from "../gameState";
import { Character } from "./Character";

export const updateCharacter = (
  character: Character | void
): Character | void => {
  if (!character) return;
  gameState.characters.set(character.id, character);
  return gameState.characters.get(character.id);
};
export const cooldowns: {
  [key in keyof Character["cooldowns"]]: number;
} = {
  renew: 120 * 60000,
};
