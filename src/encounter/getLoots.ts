
import { LootResult } from "../character/loot/loot";
import store from "../store";
import { getLoot as doGetLoot } from '../store/selectors'

export function getLoots(): Array<LootResult> {
  return doGetLoot(store.getState())
}
