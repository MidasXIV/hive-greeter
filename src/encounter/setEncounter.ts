import { Encounter } from "@adventure-bot/monster/Encounter";
import { updateEncounter } from "@adventure-bot/store/slices/encounters";
import store from '@adventure-bot/store'

export const setEncounter = (encounter: Encounter) => {
  store.dispatch(updateEncounter(encounter))
};
