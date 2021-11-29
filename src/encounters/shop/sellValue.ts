import { Item } from "../../equipment/Item";
import { getSaleRate } from "./getSaleRate";

export function sellValue(item: Item): number {
  return Math.round(getSaleRate() * item.goldValue);
}
