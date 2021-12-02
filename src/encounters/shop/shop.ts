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
import { heavyCrown } from "../../equipment/items/heavyCrown";
import { randomShopItem } from "../../equipment/randomShopItem";
import { buyItemPrompt } from "./buyItemPrompt";
import { sellItemPrompt } from "./sellItemPrompt";
import { goldValue } from "../../equipment/goldValue";
import { getCharacterUpdate } from "../../character/getCharacterUpdate";
import { isHeavyCrownInPlay } from "../../store/selectors";
import store from "../../store";

export const shop = async (interaction: CommandInteraction): Promise<void> => {
  const shopImage = new MessageAttachment(
    "./images/weapon-shop.jpg",
    "shop.png"
  );
  const character = getUserCharacter(interaction.user);
  const inventory = times(3, randomShopItem);

  if (!isHeavyCrownInPlay(store.getState()) && Math.random() <= 0.1) {
    inventory.push(heavyCrown());
  }

  const hasStuffToSell =
    character.inventory.filter((i) => i.sellable).length > 0;

  const message = await interaction.followUp(shopMain());
  if (!(message instanceof Message)) return;
  let hasLeft = false;
  while (!hasLeft) {
    await message.edit(shopMain());
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

  function shopMain() {
    const shopEmbed = new MessageEmbed({
      title: `${character.name} Visits the Shop`,
      fields: [
        {
          name: "Your Gold",
          value: goldValue({
            interaction,
            goldValue: getCharacterUpdate(character).gold,
          }),
        },
      ],
    }).setImage(`attachment://${shopImage.name}`);
    return {
      files: [shopImage],
      embeds: [
        shopEmbed,
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
          ]
            .concat(
              hasStuffToSell
                ? new MessageButton({
                    customId: "sell",
                    label: "Sell",
                    style: "PRIMARY",
                  })
                : []
            )
            .concat(
              new MessageButton({
                customId: "leave",
                label: "Leave",
                style: "SECONDARY",
              })
            ),
        }),
      ],
    };
  }
};
