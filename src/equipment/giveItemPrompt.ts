import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  SelectMenuInteraction,
} from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { itemSelect } from "../commands/itemSelect";
import { Item } from "./Item";
import { giveItem } from "./giveItem";

export const giveItemPrompt = async (
  interaction: CommandInteraction
): Promise<void> => {
  const sender = getUserCharacter(interaction.user);
  const message = await interaction.followUp({
    content: "Give up an item",
    components: [
      new MessageActionRow({
        components: [
          itemSelect({
            inventory: sender.inventory,
            placeholder: "Which item?",
          }),
        ],
      }),
    ],
  });
  if (!(message instanceof Message)) return;
  let timeout = false;
  let item: Item | void = undefined;
  const response = await message
    .awaitMessageComponent({
      time: 60000,
    })
    .catch((e) => {
      timeout = true;
    });
  if (!response) return;
  if (
    "item" === response.customId &&
    response instanceof SelectMenuInteraction
  ) {
    const slot = parseInt(response.values[0]);
    item = sender.inventory[slot];
  }
  if (timeout || !item) return;
  const offer = await interaction.followUp({
    content: `${sender.name} offers their ${item.name}.`,
    fetchReply: true,
    components: [
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: "take",
            label: `Take the ${item.name}.`,
            style: "PRIMARY",
          }),
        ],
      }),
    ],
  });

  if (!(offer instanceof Message)) return;
  const reply = await offer
    .awaitMessageComponent({
      componentType: "BUTTON",
      time: 60000,
    })
    .catch(() => {
      message.edit({ components: [] });
    });
  if (reply && reply.isButton()) {
    const recipient = getUserCharacter(reply.user);
    giveItem({
      sender,
      item,
      recipient,
    });
    offer.edit({ components: [] });
  }
};
