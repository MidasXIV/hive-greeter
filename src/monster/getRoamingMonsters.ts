import store from "../store";
import { Monster } from "./Monster";
import { getRoamingMonsters as doGetRoamingMonsters } from '../store/selectors'

export function getRoamingMonsters() {
  return doGetRoamingMonsters(store.getState())
}
