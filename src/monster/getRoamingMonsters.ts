import store from "../store";
import { getRoamingMonsters as doGetRoamingMonsters } from "../store/selectors";
import { Monster } from "./Monster";

export function getRoamingMonsters(): Monster[] {
  return doGetRoamingMonsters(store.getState());
}
