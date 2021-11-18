import { Encounter } from "../monster/Encounter";
import store from '@adventure-bot/store'
import { getAllEncounters } from "@adventure-bot/store/selectors";

export function getEncounters(): Record<string, Encounter> {
  return getAllEncounters(store.getState())
}
