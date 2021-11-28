import { randomUUID } from "crypto";
import { Armor } from "../equipment";

export const plateArmor = (): Armor => ({
  id: randomUUID(),
  type: "armor",
  description: "Strong plates to protect you.",
  goldValue: 80,
  equippable: true,
  name: "plate armor",
  modifiers: {
    ac: 4,
  },
  sellable: true,
});
