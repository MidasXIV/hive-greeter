import { weightedTable } from "../utils/weightedTable";
import { Item } from "./Item";
import {
  buckler,
  chainArmor,
  dagger,
  kiteShield,
  leatherArmor,
  longsword,
  mace,
  plateArmor,
  towerShield,
} from "./items";

export function randomChestItem(): Item {
  return weightedTable<() => Item>([
    [1.3, dagger],
    [1, mace],
    [1, longsword],
    [1.2, leatherArmor],
    [1, chainArmor],
    [0.5, plateArmor],
    [1.2, buckler],
    [1, kiteShield],
    [0.5, towerShield],
  ])();
}
