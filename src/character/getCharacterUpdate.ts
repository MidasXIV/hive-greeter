import { Character } from "./Character";
import { purgeExpiredStatuses } from "../statusEffects/purgeExpiredStatuses";
import { Monster } from "../monster/Monster";
import { getCharacter } from "./getCharacter";
import { getMonsterById } from "@adventure-bot/store/selectors";
import store from "@adventure-bot/store";

export const getCharacterUpdate = (character: Character): Character => {
  purgeExpiredStatuses(character.id);
  return getCharacter(character.id) ?? character;
};
export const getMonsterUpdate = (monster: Monster): Monster => {
  purgeExpiredStatuses(monster.id);
  return getMonsterById(store.getState(), monster.id) ?? monster;
};
