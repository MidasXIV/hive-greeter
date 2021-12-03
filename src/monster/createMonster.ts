import { randomUUID } from "crypto";
import { defaultCharacter } from "../character/defaultCharacter";
import { Monster } from "./Monster";
import store from "../store";
import { monsterCreated } from "../store/slices/characters";

export const createMonster = (
  monster: Partial<Monster> & { name: string }
): Monster => {
  const newMonster: Monster = {
    ...defaultCharacter,
    id: monster?.id ?? randomUUID(),
    ...monster,
    isMonster: true,
  };
  store.dispatch(monsterCreated(newMonster));
  console.log(`created monster ${newMonster.id}`);
  return newMonster;
};
