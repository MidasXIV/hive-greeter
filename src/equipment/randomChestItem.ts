import { weightedRandom } from "../encounters/weightedRandom";

import { Item } from "./Item";
import { buckler } from "./items/buckler";
import { chainArmor } from "./items/chainArmor";
import { dagger } from "./items/dagger";
import { kiteShield } from "./items/kiteShield";
import { leatherArmor } from "./items/leatherArmor";
import { longsword } from "./items/longsword";
import { mace } from "./items/mace";
import { plateArmor } from "./items/plateArmor";
import { towerShield } from "./items/towerShield";

export const weights = new Map<() => Item, number>([
  [dagger, 1.3],
  [mace, 1],
  [longsword, 1],
  [leatherArmor, 1.2],
  [chainArmor, 1],
  [plateArmor, 0.5],
  [buckler, 1.2],
  [kiteShield, 1],
  [towerShield, 0.5],
]);

export function randomChestItem(): Item {
  return Array.from(weights.keys())[
    weightedRandom(Array.from(weights.values()))
  ]();
}
