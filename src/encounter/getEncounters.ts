import { Encounter } from "../monster/Encounter";
import { gameState } from "../gameState";

export function getEncounters(): Map<string, Encounter> {
  return gameState.encounters;
}
