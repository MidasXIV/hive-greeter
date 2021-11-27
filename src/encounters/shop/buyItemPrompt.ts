import { CommandInteraction, Message, MessageActionRow } from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { buyItem } from "../../commands/buyItem";
import { purchaseList } from "./purchaseList";
import { Item } from "../../equipment/Item";

export async function buyItemPrompt({
  interaction,
  inventory,
}: {
  interaction: CommandInteraction;
  inventory: Item[];
}) {
  const message = await interaction.editReply({
    components: [
      new MessageActionRow({
        components: [purchaseList({ inventory, interaction })],
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
  const slot = parseInt(response.values[0]);
  if (isNaN(slot)) return;
  await buyItem(
    interaction,
    getUserCharacter(interaction.user),
    inventory[slot]
  );
}
