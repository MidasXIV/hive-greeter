import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { itemSelect } from "../commands/itemSelect";
import { isTradeable } from "./equipment";

import { giveItem } from "./giveItem";

export const offerItemPrompt = async (
  interaction: CommandInteraction
): Promise<void> => {
  const sender = getUserCharacter(interaction.user);
  const inventory = sender.inventory.filter(isTradeable);
  const message = await interaction.followUp({
    content: "Offer which item?",
    components: [
      new MessageActionRow({
        components: [
          itemSelect({
            inventory,
            placeholder: "Which item?",
          }),
        ],
      }),
    ],
  });
  if (!(message instanceof Message)) return;
  let timeout = false;
  const response = await message
    .awaitMessageComponent({
      time: 60000,
    })
    .catch(() => {
      timeout = true;
    });
  message.edit({ components: [] });
  if (!(response && response.isSelectMenu())) return;
  const item = inventory[parseInt(response.values[0])];
  if (timeout || !item) return;
  if (!item) return;
  const offer = await interaction.followUp({
    fetchReply: true,
    content: `${sender.name} offers their ${item.name}.`,
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
      offer.edit({
        content: `${item.name} is dust in the wind.`,
        components: [],
      });
    });
  if (reply && reply.isButton()) {
    const recipient = getUserCharacter(reply.user);
    giveItem({
      sender,
      item,
      recipient,
    });
    offer.edit({ components: [] });
    interaction.followUp(
      `${recipient.name} took ${sender.name}'s ${item.name}`
    );
  }
};
