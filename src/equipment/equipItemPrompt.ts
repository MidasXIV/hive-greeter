import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { equipItem } from "../character/equipItem";
import { updateCharacter } from "../character/updateCharacter";
import { itemSelect } from "../commands/itemSelect";
import { equippableInventory } from "./equippableInventory";

export const equipItemPrompt = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  const inventory = equippableInventory(character);
  if (inventory.length === 0) {
    interaction.editReply({
      content: "No inventory items available to equip",
    });
    return;
  }
  const message = await interaction.followUp({
    content: "What would you like to equip?",
    components: [
      new MessageActionRow({
        components: [
          itemSelect({
            inventory: inventory,
            placeholder: "Choose an item to equip.",
          }),
        ],
      }),
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: "done",
            style: "PRIMARY",
            label: "Done",
          }),
        ],
      }),
    ],
  });
  if (!(message instanceof Message)) return;

  let done = false;

  while (!done) {
    const response = await message.awaitMessageComponent({
      filter: (interaction) => {
        interaction.deferUpdate();
        return interaction.user.id === interaction.user.id;
      },
      time: 60000,
    });
    if (response.isButton() && response.customId === "done") {
      message.edit({ content: "Done", components: [] });
      done = true;
    }
    if (response.isSelectMenu()) {
      const item = inventory[parseInt(response.values[0])];
      updateCharacter(equipItem(getUserCharacter(interaction.user), item));
      interaction.followUp(`You equip the ${item.name}.`);
    }
  }
};
