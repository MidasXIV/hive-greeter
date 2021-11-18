import { Encounter } from "@adventure-bot/monster/Encounter";
import { gameState } from "@adventure-bot/gameState";
import { updateEncounter } from "@adventure-bot/store/slices/encounters";
import store from '@adventure-bot/store'

export const setEncounter = (encounter: Encounter) => {
  gameState.encounters.set(encounter.id, encounter);
  store.dispatch(updateEncounter(encounter))
};
