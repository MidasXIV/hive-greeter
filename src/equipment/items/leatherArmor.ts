import { randomUUID } from "crypto";
import { Armor } from "../equipment";

export const leatherArmor = (): Armor => ({
  id: randomUUID(),
  type: "armor",
  description: "Tanned hides serve to protect yours.",
  goldValue: 20,
  equippable: true,
  name: "leather armor",
  modifiers: {
    ac: 2,
  },
  sellable: true,
});
