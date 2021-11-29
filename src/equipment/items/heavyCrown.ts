import { randomUUID } from "crypto";
import { Hat } from "../equipment";

export const heavyCrown = (): Hat => ({
  id: randomUUID(),
  name: "heavy crown",
  description: "Beset with jewels, in the daylight it commands the eye.",
  equippable: true,
  goldValue: 300,
  type: "hat",
  modifiers: {
    maxHP: 5,
    attackBonus: +2,
    damageBonus: 3,
    ac: -2,
  },
  lootable: true,
  sellable: false,
});
