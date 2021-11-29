import { randomUUID } from "crypto";
import { Shield } from "../equipment";

export const towerShield = (): Shield => ({
  id: randomUUID(),
  type: "shield",
  description:
    "An enormous shield that offers great protection but can be unweildy.",
  goldValue: 80,
  name: "tower shield",
  modifiers: {
    ac: 4,
    attackBonus: -2,
  },
  equippable: true,
  sellable: true,
  tradeable: true,
});
