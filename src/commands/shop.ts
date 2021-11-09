import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
} from "discord.js";
import { Character } from "../character/Character";
import { equipItem } from "../equipItem";
import {
  adjustGold,
  getUserCharacter,
  grantItem,
  updateCharacter,
} from "../gameState";
import {
  buckler,
  chainArmor,
  dagger,
  Item,
  itemEmbed,
  kiteShield,
  leatherArmor,
  longsword,
  mace,
  plateArmor,
  towerShield,
} from "../utils/equipment";

export const command = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("If you have coin, game has wares.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const shopImage = new MessageAttachment(
    "./images/weapon-shop.jpg",
    "shop.png"
  );
  const player = getUserCharacter(interaction.user);
  const inventory = [
    dagger,
    mace,
    longsword,
    leatherArmor,
    chainArmor,
    plateArmor,
    buckler,
    kiteShield,
    towerShield,
  ];

  const message = await interaction.reply({
    files: [shopImage],
    embeds: [
      new MessageEmbed()
        .setImage(`attachment://${shopImage.name}`)
        .addField("Your Gold", "💰 " + player.gold.toString()),
      ...inventory.map(itemEmbed),
    ],
    components: [
      new MessageActionRow({ components: [inventorySelector(inventory)] }),
    ],
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;
  const response = await message
    .awaitMessageComponent({
      filter: (i) => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
      },
      componentType: "SELECT_MENU",
      time: 60000,
    })
    .catch(() => {
      message.edit({
        files: [shopImage],
        embeds: [
          new MessageEmbed()
            .setImage(`attachment://${shopImage.name}`)
            .addField("Your Gold", "💰 " + player.gold.toString()),
          ...inventory.map(itemEmbed),
        ],
        components: [],
      });
    });

  if (!response || !response.isSelectMenu()) return;
  const item = inventory[parseInt(response.values[0])];
  if (!item) return;
  await buyItem(interaction, player, item);
};

const equipItemButton = (item: Item) =>
  new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("equip")
      .setLabel(`Equip the ${item.name}`)
      .setStyle("PRIMARY")
  );

const buyItem = async (
  interaction: CommandInteraction,
  player: Character,
  item: Item
) => {
  if (player.gold <= item.goldValue) {
    await interaction.followUp(
      `You cannot afford the ${item.name}. You have only ${player.gold} gold and it costs ${item.goldValue}.`
    );
    return;
  }
  adjustGold(player.id, -item.goldValue);
  grantItem(player.id, item);

  const content = `You are the proud owner of a new ${item.name}.`;

  const message = await interaction.followUp({
    content,
    components: [equipItemButton(item)],
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
      return;
    });
  if (response) {
    updateCharacter(equipItem(getUserCharacter(interaction.user), item));
    message.edit({
      content,
      components: [],
    });
    message.reply(`You equip the ${item.name}.`);
  }
};

export default { command, execute };

const inventorySelector = (inventory: Item[]) =>
  new MessageSelectMenu()
    .setCustomId("item")
    .setPlaceholder("What would you like to buy?")
    .addOptions(
      inventory.map((item, i) => ({
        label: item.name,
        description: `💰${item.goldValue} ${item.description}`,
        value: i.toString(),
      }))
    );
