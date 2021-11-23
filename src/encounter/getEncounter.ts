import { Encounter } from "../monster/Encounter";
import { getEncounterById } from "../store/selectors";
import store from '../store'

export function getEncounter(encounterId: string): Encounter | void {
  return getEncounterById(store.getState(), encounterId);
}
