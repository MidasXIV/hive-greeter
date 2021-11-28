import { randomUUID } from "crypto";
import { Armor } from "../equipment";

export const chainArmor = (): Armor => ({
  id: randomUUID(),
  type: "armor",
  description: "Linked metal chains worn to protect.",
  goldValue: 40,
  equippable: true,
  name: "chain armor",
  modifiers: {
    ac: 3,
  },
  sellable: true,
});
