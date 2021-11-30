import { Monster } from "./Monster";
import { updateMonster as doUpdateMonster } from "../store/slices/monsters";
import store from "../store";
import { getMonsterById } from "../store/selectors";

export const updateMonster = (monster: Monster): Monster => {
  console.log("update monster", monster);
  store.dispatch(doUpdateMonster(monster));
  return getMonsterById(store.getState(), monster.id) ?? monster;
};
