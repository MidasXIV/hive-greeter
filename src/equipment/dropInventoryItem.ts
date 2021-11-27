import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { Character } from "../character/Character";
import { getUserCharacter } from "../character/getUserCharacter";
import { equipmentFilter } from "../character/loot/loot";
import { updateCharacter } from "../character/updateCharacter";

export async function dropInventoryItem({
  character,
  slot,
  interaction,
}: {
  character: Character;
  slot: number;
  interaction: CommandInteraction;
}): Promise<void> {
  const droppedItem = character.inventory.splice(slot, 1)[0];
  if (!droppedItem) {
    console.error(`inventory item not found`, {
      inventory: character.inventory,
      slot,
    });
    interaction.followUp(`No item found in inventory slot ${slot}`);
    return;
  }

  updateCharacter({
    ...character,
    equipment: equipmentFilter(
      character.equipment,
      (item) => item.id !== droppedItem.id
    ),
  });

  const message = await interaction.followUp({
    content: `You dropped your ${droppedItem.name}.`,
    fetchReply: true,
    components: [
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: "pickup",
            label: `Pick the ${droppedItem.name} back up.`,
            style: "SECONDARY",
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
      const character = getUserCharacter(interaction.user);
      character.inventory.push(droppedItem);
      updateCharacter(character);
      message.edit({
        content: `${droppedItem.name} picked back up.`,
        components: [],
      });
    });
}
