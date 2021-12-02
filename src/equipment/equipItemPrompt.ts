import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import inspect from "../commands/inspect/inspect";
import { getUserCharacter } from "../character/getUserCharacter";
import { equipItem } from "../character/equipItem";
import { updateCharacter } from "../character/updateCharacter";
import { Item } from "./Item";
import { itemEmbed } from "./itemEmbed";

/**
 * Prompt to equip a specific item
 * @param interaction
 * @param item
 * @returns
 */
export const equipItemPrompt = async (
  interaction: CommandInteraction,
  item: Item
): Promise<void> => {
  const content = `Would you like to equip the ${item.name}?`;
  const message = await interaction.followUp({
    content,
    embeds: [itemEmbed({ item, interaction })],
    components: [
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: "equip",
            label: `Equip the ${item.name}`,
            style: "SECONDARY",
          }),
        ],
      }),
    ],
  });

  if (!(message instanceof Message)) return;
  const response = await message
    .awaitMessageComponent({
      filter: (interaction) => {
        interaction.deferUpdate();
        return interaction.user.id === interaction.user.id;
      },
      componentType: "BUTTON",
      time: 60000,
    })
    .catch(() => {
      message.edit({
        content,
        components: [],
      });
    });
  if (!response) return;
  updateCharacter(equipItem(getUserCharacter(interaction.user), item));
  message.edit({
    content,
    components: [],
  });
  message.reply(`You equip the ${item.name}.`);
  await inspect.execute(interaction);
};
