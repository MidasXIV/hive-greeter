import { randomUUID } from "crypto";
import { Armor } from "../equipment";

export const plateArmor = (): Armor => ({
  id: randomUUID(),
  type: "armor",
  description: "Strong plates to protect you.",
  goldValue: 80,
  name: "plate armor",
  modifiers: {
    ac: 4,
  },
  equippable: true,
  sellable: true,
  tradeable: true,
});
