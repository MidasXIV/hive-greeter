import { Encounter } from "../monster/Encounter";
import { gameState } from "../gameState";

export const setEncounter = (encounter: Encounter) =>
  gameState.encounters.set(encounter.id, encounter);
