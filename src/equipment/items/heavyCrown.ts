import { randomUUID } from "crypto";
import { Hat } from "../equipment";

export const heavyCrown = (): Hat => ({
  id: randomUUID(),
  name: "heavy crown",
  description: "Beset with jewels, in the daylight it commands the eye.",
  goldValue: 300,
  type: "hat",
  modifiers: {
    maxHP: 5,
    attackBonus: +2,
    damageBonus: 3,
    ac: -2,
  },
  equippable: true,
  sellable: true,
  tradeable: true,
});
