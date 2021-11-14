import { gameState } from "../gameState";
import { Monster } from "../monster/Monster";
import { Character } from "./Character";

const isMonster = (character: Character): character is Monster =>
  character.isMonster ?? false;

export const updateCharacter = (
  character: Character | void
): Character | void => {
  if (!character) return;

  if (isMonster(character)) {
    gameState.monsters.set(character.id, character);
    return gameState.monsters.get(character.id);
  } else {
    gameState.characters.set(character.id, character);
    return gameState.characters.get(character.id);
  }
};
