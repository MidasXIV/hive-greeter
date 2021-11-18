import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageEmbed,
} from "discord.js";
import { getUserCharacter } from "@adventure-bot/character/getUserCharacter";
import { itemEmbed } from "@adventure-bot/equipment/equipment";
import { times } from "remeda";
import { heavyCrown } from "@adventure-bot/heavyCrown/heavyCrown";
import { buyItem } from "@adventure-bot/commands/buyItem";
import { randomInventoryItem } from "@adventure-bot/commands/randomInventoryItem";
import { inventorySelector } from "@adventure-bot/commands/inventorySelector";
import { hasItemNameInInventory } from '@adventure-bot/store/selectors/index';
import store from "@adventure-bot/store";

export const shop = async (interaction: CommandInteraction): Promise<void> => {
  const shopImage = new MessageAttachment(
    "./images/weapon-shop.jpg",
    "shop.png"
  );
  const player = getUserCharacter(interaction.user);
  const inventory = times(3, randomInventoryItem);

  const hasHeavyCrown = hasItemNameInInventory(store.getState(), player, 'heavy crown')

  if (!hasHeavyCrown && Math.random() <= 0.1) {
    inventory.push(heavyCrown);
  }

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
