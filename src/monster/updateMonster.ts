import { Monster } from "./Monster";
import { updateMonster as doUpdateMonster } from "@adventure-bot/store/slices/monsters";
import store from "@adventure-bot/store";
import { getMonsterById } from "@adventure-bot/store/selectors";

export const updateMonster = (monster: Monster): Monster => {
  console.log("update monster", monster);
  store.dispatch(doUpdateMonster(monster));
  return getMonsterById(store.getState(), monster.id) ?? monster;
};
