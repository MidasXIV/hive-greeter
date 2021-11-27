import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageEmbed,
} from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { itemEmbed } from "../equipment/itemEmbed";
import { times } from "remeda";
import { isHeavyCrownInPlay } from "../heavyCrown/isHeavyCrownInPlay";
import { heavyCrown } from "../heavyCrown/heavyCrown";
import { buyItem } from "../commands/buyItem";
import { randomShopItem } from "../equipment/randomShopItem";
import { inventorySelector } from "../commands/inventorySelector";
import { Emoji } from "../Emoji";

export const shop = async (interaction: CommandInteraction): Promise<void> => {
  const shopImage = new MessageAttachment(
    "./images/weapon-shop.jpg",
    "shop.png"
  );
  const player = getUserCharacter(interaction.user);
  const inventory = times(3, randomShopItem);

  if (!isHeavyCrownInPlay() && Math.random() <= 0.1) {
    inventory.push(heavyCrown);
  }

  const message = await interaction.reply({
    files: [shopImage],
    embeds: [
      new MessageEmbed()
        .setImage(`attachment://${shopImage.name}`)
        .addField(
          "Your Gold",
          Emoji(interaction, "gold") + " " + player.gold.toString()
        ),
      ...inventory.map((item) => itemEmbed({ item, interaction })),
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
            .addField(
              "Your Gold",
              Emoji(interaction, "gold") + " " + player.gold.toString()
            ),
          ...inventory.map((item) => itemEmbed({ item, interaction })),
        ],
        components: [],
      });
    });

  if (!response || !response.isSelectMenu()) return;
  const item = inventory[parseInt(response.values[0])];
  if (!item) return;
  await buyItem(interaction, player, item);
};
