import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { itemEmbed } from "../../equipment/itemEmbed";
import { times } from "remeda";
import { isHeavyCrownInPlay } from "../../heavyCrown/isHeavyCrownInPlay";
import { heavyCrown } from "../../heavyCrown/heavyCrown";
import { randomShopItem } from "../../equipment/randomShopItem";
import { Emoji } from "../../Emoji";
import { buyItemPrompt } from "./buyItemPrompt";
import { sellItemPrompt } from "./sellItemPrompt";

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
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: "buy",
            label: "Buy",
            style: "PRIMARY",
          }),
          new MessageButton({
            customId: "sell",
            label: "Sell",
            style: "PRIMARY",
          }),
          new MessageButton({
            customId: "leave",
            label: "Leave",
            style: "SECONDARY",
          }),
        ],
      }),
    ],
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;
  let hasLeft = false;
  while (!hasLeft) {
    const response = await message
      .awaitMessageComponent({
        filter: (i) => {
          i.deferUpdate();
          return i.user.id === interaction.user.id;
        },
        componentType: "BUTTON",
        time: 60000,
      })
      .catch(() => {
        message.edit({
          components: [],
        });
      });

    if (!response || !response.isButton()) return;
    if (response.customId === "leave") hasLeft = true;
    if (response.customId === "buy")
      await buyItemPrompt({ interaction, inventory });
    if (response.customId === "sell") await sellItemPrompt({ interaction });
  }
  interaction.editReply({ components: [] });
};
