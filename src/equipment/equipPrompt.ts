import { CommandInteraction, Message, MessageActionRow } from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { equipItem } from "../character/equipItem";
import { updateCharacter } from "../character/updateCharacter";
import { itemSelect } from "../commands/itemSelect";
import { equippableInventory } from "./equippableInventory";

export const equipPrompt = async (
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
  const message = await interaction.editReply({
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
    ],
  });
  if (!(message instanceof Message)) return;

  const response = await message.awaitMessageComponent({
    filter: (interaction) => {
      interaction.deferUpdate();
      return interaction.user.id === interaction.user.id;
    },
    componentType: "SELECT_MENU",
    time: 60000,
  });
  const item = character.inventory[parseInt(response.values[0])];
  updateCharacter(equipItem(getUserCharacter(interaction.user), item));
  interaction.followUp(`You equip the ${item.name}.`);
};
