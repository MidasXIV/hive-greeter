import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageEmbed,
} from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { sellItem } from "./sellItem";
import { itemEmbed } from "../../equipment/itemEmbed";
import { gpGainField } from "../../character/gpGainField";
import { sellList } from "./sellList";
import { getSaleRate } from "./getSaleRate";
import { sellValue } from "./sellValue";

export async function sellItemPrompt({
  interaction,
}: {
  interaction: CommandInteraction;
}): Promise<void> {
  const saleRate = getSaleRate();
  const shopImage = new MessageAttachment(
    "./images/weapon-shop.jpg",
    "shop.png"
  );

  const character = getUserCharacter(interaction.user);
  const inventory = character.inventory.filter((i) => i.sellable);
  const message = await interaction.editReply({
    embeds: [
      new MessageEmbed({ title: "Sell which item?" }).setImage(
        `attachment://${shopImage.name}`
      ),
      ...inventory.map((item) =>
        itemEmbed({ item, interaction, saleRate: saleRate })
      ),
    ],
    components: [
      new MessageActionRow({
        components: [
          sellList({
            inventory,
            interaction,
          }),
        ],
      }),
    ],
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
        components: [],
      });
    });
  if (!response) return;
  const item = inventory[parseInt(response.values[0])];
  if (!item) return;
  sellItem({ character, item });
  interaction.followUp({
    embeds: [
      new MessageEmbed({
        fields: [gpGainField(interaction, sellValue(item))],
      }),
    ],
    content: `${character.name} sold their ${item.name}.`,
  });
}
