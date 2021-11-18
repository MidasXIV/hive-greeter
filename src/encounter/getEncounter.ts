import { Encounter } from "../monster/Encounter";
import { getEncounterById } from "@adventure-bot/store/selectors";
import store from '@adventure-bot/store'

export function getEncounter(encounterId: string): Encounter | void {
  return getEncounterById(store.getState(), encounterId);
}
