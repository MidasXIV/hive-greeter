import { Encounter } from "../monster/Encounter";
import { gameState } from "../gameState";

export function getEncounter(encounterId: string): Encounter | void {
  return gameState.encounters.get(encounterId);
}
