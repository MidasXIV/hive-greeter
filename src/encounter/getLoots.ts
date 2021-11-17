import { gameState } from "../gameState";
import { LootResult } from "../character/loot/loot";

export function getLoots(): Map<string, LootResult> {
  return gameState.loots;
}
