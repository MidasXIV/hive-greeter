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
