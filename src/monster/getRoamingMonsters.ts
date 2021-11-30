import store from "../store";
import { getRoamingMonsters as doGetRoamingMonsters } from "../store/selectors";

export function getRoamingMonsters() {
  return doGetRoamingMonsters(store.getState());
}
