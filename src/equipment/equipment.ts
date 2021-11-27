import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import inspect from "../commands/inspect/inspect";
import { getUserCharacter } from "../character/getUserCharacter";
import { equipItem } from "../character/equipItem";
import { updateCharacter } from "../character/updateCharacter";
import { Item } from "./Item";
import { itemEmbed } from "./itemEmbed";
import { randomUUID } from "crypto";

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

export const createItem = (item: Item): Item => ({ ...item, id: randomUUID() });

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
  sellable: true,
};

export const mace: Weapon = {
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
  sellable: true,
};

export const leatherArmor: Armor = {
  type: "armor",
  description: "Tanned hides serve to protect yours.",
  goldValue: 20,
  equippable: true,
  name: "leather armor",
  modifiers: {
    ac: 2,
  },
  sellable: true,
};

export const chainArmor: Armor = {
  type: "armor",
  description: "Linked metal chains worn to protect.",
  goldValue: 40,
  equippable: true,
  name: "chain armor",
  modifiers: {
    ac: 3,
  },
  sellable: true,
};

export const plateArmor: Armor = {
  type: "armor",
  description: "Strong plates to protect you.",
  goldValue: 80,
  equippable: true,
  name: "plate armor",
  modifiers: {
    ac: 4,
  },
  sellable: true,
};

export const buckler: Shield = {
  type: "shield",
  description: "A small and nimble shield that doesn't get in the way.",
  goldValue: 20,
  equippable: true,
  name: "buckler",
  modifiers: {
    ac: 1,
  },
  sellable: true,
};

export const kiteShield: Shield = {
  type: "shield",
  description:
    "A medium sized shield named for its resemblance to the children's windy day toy.",
  goldValue: 40,
  equippable: true,
  name: "kite shield",
  modifiers: {
    ac: 2,
  },
  sellable: true,
};

export const towerShield: Shield = {
  type: "shield",
  description:
    "An enormous shield that offers great protection but can be unweildy.",
  goldValue: 80,
  equippable: true,
  name: "tower shield",
  modifiers: {
    ac: 4,
    attackBonus: -2,
  },
  sellable: true,
};

export const equipItemPrompt = async (
  interaction: CommandInteraction,
  item: Item
): Promise<void> => {
  const content = `Would you like to equip the ${item.name}?`;
  const message = await interaction.followUp({
    content,
    embeds: [itemEmbed({ item, interaction })],
    components: [
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: "equip",
            label: `Equip the ${item.name}`,
            style: "PRIMARY",
          }),
        ],
      }),
    ],
  });

  if (!(message instanceof Message)) return;
  const response = await message
    .awaitMessageComponent({
      filter: (interaction) => {
        interaction.deferUpdate();
        return interaction.user.id === interaction.user.id;
      },
      componentType: "BUTTON",
      time: 60000,
    })
    .catch(() => {
      message.edit({
        content,
        components: [],
      });
    });
  if (!response) return;
  updateCharacter(equipItem(getUserCharacter(interaction.user), item));
  message.edit({
    content,
    components: [],
  });
  message.reply(`You equip the ${item.name}.`);
  await inspect.execute(interaction, "followUp");
};
