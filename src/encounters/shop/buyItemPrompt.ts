import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { buyItem } from "../../commands/buyItem";
import { buyList } from "./buyList";
import { Item } from "../../equipment/Item";

export async function buyItemPrompt({
  interaction,
  inventory,
}: {
  interaction: CommandInteraction;
  inventory: Item[];
}): Promise<void | Item> {
  const message = await interaction.editReply({
    components: [
      new MessageActionRow({
        components: [buyList({ inventory, interaction })],
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
  await buyItem(interaction, getUserCharacter(interaction.user), item);
  return item;
}
