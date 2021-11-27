import { weightedRandom } from "../encounters/weightedRandom";
import {
  buckler,
  chainArmor,
  createItem,
  dagger,
  kiteShield,
  leatherArmor,
  longsword,
  mace,
  plateArmor,
  towerShield,
} from "./equipment";
import { Item } from "./Item";

export const weights = new Map<Item, number>([
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
  return createItem(
    Array.from(weights.keys())[weightedRandom(Array.from(weights.values()))]
  );
}
