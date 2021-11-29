import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { sellItem } from "./sellItem";
import { itemEmbed } from "../../equipment/itemEmbed";
import { gpGainField } from "../../character/gpGainField";
import { sellList } from "./sellList";
import { getSaleRate } from "./getSaleRate";
import { sellValue } from "./sellValue";
import { goldValue } from "../../equipment/goldValue";
import { getCharacterUpdate } from "../../character/getCharacterUpdate";

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
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: "cancel",
            style: "SECONDARY",
            label: "Nevermind",
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
      time: 60000,
    })
    .catch(() => {
      message.edit({
        components: [],
      });
    });
  if (!response) return;
  if (!response.isSelectMenu()) return;
  const item = inventory[parseInt(response.values[0])];
  if (!item) return;
  sellItem({ character, item });
  interaction.followUp({
    embeds: [
      new MessageEmbed({
        fields: [
          gpGainField(interaction, sellValue(item)),
          {
            name: `${character.name}'s Total Gold`,
            value: goldValue({
              interaction,
              goldValue: getCharacterUpdate(character).gold,
            }),
          },
        ],
      }),
    ],
    content: `${character.name} sold their ${item.name}.`,
  });
}
