import { purgeExpiredStatuses } from "../statusEffects/purgeExpiredStatuses";
import { Monster } from "./Monster";
import { getMonsterById } from "../store/selectors";
import store from "../store";

export const getMonsterUpdate = (monster: Monster): Monster => {
  purgeExpiredStatuses(monster.id);
  return getMonsterById(store.getState(), monster.id) ?? monster;
};
