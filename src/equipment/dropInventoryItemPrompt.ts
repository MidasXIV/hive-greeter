import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { Character } from "../character/Character";
import { itemSelect } from "../commands/itemSelect";
import { dropInventoryItem } from "./dropInventoryItem";

export async function dropInventoryItemPrompt(
  interaction: CommandInteraction,
  character: Character
): Promise<void> {
  const message = await interaction.followUp({
    content: "Drop which item?",
    fetchReply: true,
    components: [
      new MessageActionRow({
        components: [
          itemSelect({
            inventory: character.inventory,
            placeholder: "Choose an item to drop.",
          }),
        ],
      }),
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: "cancel",
            style: "SECONDARY",
            label: "Cancel",
          }),
        ],
      }),
    ],
  });
  if (!(message instanceof Message)) return;
  message
    .awaitMessageComponent({
      componentType: "BUTTON",
      filter: (i) => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
      },
    })
    .then(() => {
      message.edit({
        content: "No items dropped. 👍",
        components: [],
      });
    });

  message
    .awaitMessageComponent({
      componentType: "SELECT_MENU",
      filter: (i) => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
      },
    })
    .then((i) => {
      const slot = parseInt(i.values[0]);
      dropInventoryItem({ character, slot, interaction });
    });
}
