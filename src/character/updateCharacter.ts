import { gameState } from "../gameState";
import { Monster } from "../monster/Monster";
import { Character } from "./Character";

import store from '../store'
import { updateCharacter as doUpdateCharacter } from "../store/slices/characters";
import { updateMonster as doUpdateMonster } from "../store/slices/monsters";

const isMonster = (character: Character): character is Monster =>
  character.isMonster ?? false;

export const updateCharacter = (
  character: Character | void
): Character | void => {
  if (!character) return;

  if (isMonster(character)) {
    store.dispatch(doUpdateMonster(character))
    gameState.monsters.set(character.id, character);
    // return gameState.monsters.get(character.id);
  } else {
    
    store.dispatch(doUpdateCharacter(character))
    gameState.characters.set(character.id, character);
    // return gameState.characters.get(character.id);
  }
  return character
};
