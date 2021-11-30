import { Encounter } from "../monster/Encounter";
import { updateEncounter } from "../store/slices/encounters";
import store from '../store'

export const setEncounter = (encounter: Encounter) => {
  store.dispatch(updateEncounter(encounter))
};
