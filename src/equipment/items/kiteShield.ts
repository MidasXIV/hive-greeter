import { randomUUID } from "crypto";
import { Shield } from "../equipment";

export const kiteShield = (): Shield => ({
  id: randomUUID(),
  type: "shield",
  description:
    "A medium sized shield named for its resemblance to the children's windy day toy.",
  goldValue: 40,
  name: "kite shield",
  modifiers: {
    ac: 2,
  },
  equippable: true,
  sellable: true,
  tradeable: true,
});
