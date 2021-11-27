import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} from "discord.js";
import { Character } from "../character/Character";
import { getUserCharacter } from "../character/getUserCharacter";
import { itemEmbed } from "../equipment/itemEmbed";
import { Item } from "../equipment/Item";
import { updateCharacter } from "../character/updateCharacter";
import { equipPrompt } from "../equipment/equipPrompt";

export const command = new SlashCommandBuilder()
  .setName("inventory")
  .setDescription("View your inventory.");

export const execute = async (
  interaction: CommandInteraction,
  responseType: "followUp" | "reply" = "reply"
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  console.log(`${character.name}'s inventory`, character.inventory);
  if (!character.inventory.length) {
    await interaction[responseType]("Your inventory is empty.");
    return;
  }
  const message = await interaction[responseType]({
    embeds: character.inventory.map((item) => itemEmbed({ item, interaction })),
    fetchReply: true,
    components: [
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: "equip",
            style: "SECONDARY",
            label: "Equip",
          }),
          new MessageButton({
            customId: "drop",
            style: "SECONDARY",
            label: "Drop",
          }),
          new MessageButton({
            customId: "give",
            style: "SECONDARY",
            label: "Give",
          }),
        ],
      }),
    ],
  });
  if (!(message instanceof Message)) return;
  const reply = await message.awaitMessageComponent({
    filter: (i) => {
      i.deferUpdate();
      return i.user.id === interaction.user.id;
    },
    componentType: "BUTTON",
  });
  if (reply.customId === "drop") {
    await dropInventoryItemPrompt(interaction, character);
  }
  if (reply.customId === "equip") {
    await equipPrompt(interaction, true);
  }
};

const itemSelect = (inventory: Item[], placeholder = "Which item?") =>
  new MessageSelectMenu({
    customId: "item",
    placeholder,
  }).addOptions(
    inventory.map((item, i) => ({
      label: item.name,
      description: item.description,
      value: i.toString(),
    }))
  );

export default { command, execute };

async function dropInventoryItemPrompt(
  interaction: CommandInteraction,
  character: Character
) {
  const message = await interaction.followUp({
    content: "Drop which item?",
    fetchReply: true,
    components: [
      new MessageActionRow({
        components: [
          itemSelect(character.inventory, "Choose an item to drop."),
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
async function dropInventoryItem({
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
      message.edit({
        content: "No items dropped. 👍",
        components: [],
      });
    });
}
