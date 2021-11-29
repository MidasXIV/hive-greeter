import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { itemSelect } from "../commands/itemSelect";
import { dropItemConfirm } from "./dropItemConfirm";

export async function dropItemPrompt(
  interaction: CommandInteraction
): Promise<void> {
  const character = getUserCharacter(interaction.user);
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
      message.edit({
        content: `${character.inventory[slot].name} dropped.`,
        components: [],
      });
      dropItemConfirm({ character, slot, interaction });
    });
}
