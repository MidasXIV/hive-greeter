import store from "@adventure-bot/store";
import { Monster } from "./Monster";
import { getRoamingMonsters as doGetRoamingMonsters } from '@adventure-bot/store/selectors'

export function getRoamingMonsters() {
  return doGetRoamingMonsters(store.getState())
}
