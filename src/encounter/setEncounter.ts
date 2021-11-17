import { Encounter } from "../monster/Encounter";
import { gameState } from "../gameState";
import { updateEncounter } from "../store/slices/encounters";
import store from '../store'

export const setEncounter = (encounter: Encounter) => {
  gameState.encounters.set(encounter.id, encounter);
  store.dispatch(updateEncounter(encounter))
};
