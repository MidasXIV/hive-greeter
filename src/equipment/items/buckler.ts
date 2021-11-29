import { randomUUID } from "crypto";
import { Shield } from "../equipment";

export const buckler = (): Shield => ({
  id: randomUUID(),
  type: "shield",
  description: "A small and nimble shield that doesn't get in the way.",
  goldValue: 20,
  equippable: true,
  name: "buckler",
  modifiers: {
    ac: 1,
  },
  sellable: true,
});
