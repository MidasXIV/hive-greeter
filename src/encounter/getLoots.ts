
import { LootResult } from "../character/loot/loot";
import store from "@adventure-bot/store";
import { getLoot as doGetLoot } from '@adventure-bot/store/selectors'

export function getLoots(): Array<LootResult> {
  return doGetLoot(store.getState())
}
