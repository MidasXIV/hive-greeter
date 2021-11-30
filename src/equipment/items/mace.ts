import { randomUUID } from "crypto";
import { Weapon } from "../equipment";

export const mace = (): Weapon => ({
  id: randomUUID(),
  type: "weapon",
  name: "mace",
  description: "A sturdy and reliable means of crushing your foes.",
  modifiers: {
    damageBonus: 1,
  },
  damageMax: 4,
  goldValue: 40,
  accuracyDescriptors: {
    wideMiss: ["<@attacker>'s mace swings clumbsily at <@defender>"],
    nearMiss: ["<@attacker>'s mace nearly crushes <@defender>"],
    onTheNose: ["<@attacker>'s mace crushes <@defender>"],
    veryAccurate: ["<@attacker>'s mace crushes <@defender> true"],
  },
  equippable: true,
  sellable: true,
  tradeable: true,
});
