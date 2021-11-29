import { Item } from "./Item";

export type Equippable = Item & { equippable: true };
export type Tradeable = Item & { tradeable: true };

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

export type Armor = Equippable & {
  type: "armor";
};
export type Shield = Equippable & {
  type: "shield";
};

export type Hat = Equippable & {
  type: "hat";
};

export const isHat = (item: Item): item is Hat => item.type === "hat";
export const isArmor = (item: Item): item is Armor => item.type === "armor";
export const isShield = (item: Item): item is Shield => item.type === "shield";
export const isWeapon = (item: Item): item is Weapon => item.type === "weapon";
export const isEquippable = (item: Item): item is Equippable => item.equippable;
export const isTradeable = (item: Item): item is Tradeable =>
  item.tradeable ?? false;
