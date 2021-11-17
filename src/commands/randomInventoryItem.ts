import { weightedRandom } from "./encounters/weightedRandom";
import {
  buckler,
  chainArmor,
  dagger,
  Item,
  kiteShield,
  leatherArmor,
  longsword,
  mace,
  plateArmor,
  towerShield,
} from "../equipment/equipment";

export const weights = new Map<Item, number>([
  [dagger, 1],
  [mace, 1],
  [longsword, 1],
  [leatherArmor, 1],
  [chainArmor, 1],
  [plateArmor, 1],
  [buckler, 1],
  [kiteShield, 1],
  [towerShield, 1],
]);

export function randomInventoryItem(): Item {
  return Array.from(weights.keys())[
    weightedRandom(Array.from(weights.values()))
  ];
}
