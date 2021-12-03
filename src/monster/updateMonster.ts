import { Monster } from "./Monster";
import store from "../store";
import { getMonsterById } from "../store/selectors";
import { updateCharacter } from "../character/updateCharacter";

export const updateMonster = (monster: Monster): Monster => {
  updateCharacter(monster);
  return getMonsterById(store.getState(), monster.id) ?? monster;
};
