import { Character } from "./Character";
import { purgeExpiredStatuses } from "../statusEffects/purgeExpiredStatuses";
import { Monster } from "../monster/Monster";

import store from "@adventure-bot/store";
import { getCharacterById, getMonsterById } from "@adventure-bot/store/selectors";

export const getCharacterUpdate = (character: Character): Character => {
  purgeExpiredStatuses(character.id)
  return getCharacterById(store.getState(), character.id) ?? character
};
export const getMonsterUpdate = (monster: Monster): Monster => {
  purgeExpiredStatuses(monster.id);
  return getMonsterById(store.getState(), monster.id) ?? monster
};
