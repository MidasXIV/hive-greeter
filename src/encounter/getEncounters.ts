import store from '@adventure-bot/store'
import { getAllEncounters } from "@adventure-bot/store/selectors";

export function getEncounters() {
  return getAllEncounters(store.getState())
}
