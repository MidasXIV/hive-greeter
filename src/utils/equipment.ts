import { MessageEmbed } from "discord.js";
import { StatModifier } from "../status-effets/StatModifier";

export type Item = {
  type: "weapon" | "armor" | "shield";
  name: string;
  description: string;
  goldValue: number;
  modifiers?: StatModifier;
  equippable: boolean;
};
export type Equippable = Item & { equippable: true };

export type Weapon = Equippable & {
  type: "weapon";
  damageMax: number;
  accuracyDescriptors: {
    wideMiss: string[];
    nearMiss: string[];
    onTheNose: string[];
    veryAccurate: string[];
  };
  // TODO:
  // damageDescriptors: {
  //   minimum: string[];
  //   weak: string[];
  //   average: string[];
  //   strong: string[];
  //   maximum: string[];
  // }
};
export const itemIsWeapon = (item: Item): item is Weapon =>
  item.type === "weapon";

export const itemIsEquippable = (item: Item): item is Equippable =>
  item.equippable;

export const dagger: Weapon = {
  type: "weapon",
  name: "dagger",
  description: "A small and nimble blade. Cheap and versatile.",
  damageMax: 4,
  modifiers: {
    attackBonus: 3,
  },
  goldValue: 20,
  accuracyDescriptors: {
    wideMiss: [
      "<@attacker>'s dagger slashes in the approximate direction of <@defender>",
    ],
    nearMiss: ["<@attacker>'d dagger nearly stabs <@defender>"],
    onTheNose: ["<@attacker>'s dagger pierces <@defender>"],
    veryAccurate: ["<@attacker>'s dagger pierces <@defender> true"],
  },
  equippable: true,
};
export const mace: Weapon = {
  type: "weapon",
  name: "mace",
  description: "A sturdy and reliable means of crushing your foes.",
  modifiers: {
    attackBonus: 1,
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
};
export const longsword: Weapon = {
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
};

export const itemEmbed = (item: Item): MessageEmbed => {
  const embed = new MessageEmbed()
    .setTitle(item.name)
    .setDescription(item.description)
    .setFooter("💰" + item.goldValue.toString());
  if (itemIsWeapon(item)) {
    embed.addField("Damage Max", item.damageMax.toString(), true);
    if (item.modifiers?.attackBonus)
      embed.addField(
        "Attack Bonus",
        item.modifiers.attackBonus.toString(),
        true
      );
    if (item.modifiers?.damageBonus)
      embed.addField(
        "Damage Bonus",
        item.modifiers.damageBonus.toString(),
        true
      );
  }
  return embed;
};
