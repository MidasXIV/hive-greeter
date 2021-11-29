import { Character } from "./Character";
import { purgeExpiredStatuses } from "../statusEffects/purgeExpiredStatuses";

import store from "../store";
import { getCharacterById } from "../store/selectors";

export const getCharacterUpdate = (character: Character): Character => {
  purgeExpiredStatuses(character.id);
  return getCharacterById(store.getState(), character.id) ?? character;
};
