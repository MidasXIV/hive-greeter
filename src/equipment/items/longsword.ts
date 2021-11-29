import { randomUUID } from "crypto";
import { Weapon } from "../equipment";

export const longsword = (): Weapon => ({
  id: randomUUID(),
  type: "weapon",
  name: "longsword",
  description: "A classic for a reason. Purpose built and effective.",
  damageMax: 8,
  goldValue: 40,
  accuracyDescriptors: {
    wideMiss: ["<@attacker>'s longsword swings wide at <@defender>"],
    nearMiss: ["<@attacker>'s longsword nearly slashes <@defender>"],
    onTheNose: ["<@attacker>'s longsword slashes <@defender>"],
    veryAccurate: ["<@attacker>'s longsword cuts <@defender> true"],
  },
  equippable: true,
  sellable: true,
});
