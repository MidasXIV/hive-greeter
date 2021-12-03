import { Character } from "../character/Character";

import store from "../store";
import { updateCharacter as doUpdateCharacter } from "../store/slices/characters";

export const updateCharacter = <T extends Character>(character: T): T => {
  store.dispatch(doUpdateCharacter(character));
  return character;
};
