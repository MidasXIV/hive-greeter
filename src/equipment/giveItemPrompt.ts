import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  SelectMenuInteraction,
} from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { itemSelect } from "../commands/itemSelect";
import { getUserCharacters } from "../character/getUserCharacters";
import { Item } from "./Item";
import { Character } from "../character/Character";
import { getCharacter } from "../character/getCharacter";
import { giveItem } from "./giveItem";

export const giveItemPrompt = async (
  interaction: CommandInteraction
): Promise<void> => {
  const sender = getUserCharacter(interaction.user);
  const message = await interaction.editReply({
    content: "Give someone an item",
    components: [
      new MessageActionRow({
        components: [
          itemSelect({
            inventory: sender.inventory,
            placeholder: "Which item?",
          }),
        ],
      }),
      new MessageActionRow({
        components: [
          new MessageSelectMenu({
            customId: "recipient",
            placeholder: "To whom?",
            options: getUserCharacters().map((character) => ({
              label: character.name,
              value: character.id,
            })),
          }),
        ],
      }),
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: "send",
            label: "Send",
            style: "PRIMARY",
          }),
          new MessageButton({
            customId: "cancel",
            label: "Cancel",
            style: "SECONDARY",
          }),
        ],
      }),
    ],
  });
  if (!(message instanceof Message)) return;
  let send = false;
  let timeout = false;
  let cancel = false;
  let item: Item | void = undefined;
  let recipient: Character | void = undefined;
  while (!(send || cancel || timeout)) {
    const response = await message
      .awaitMessageComponent({
        time: 60000,
        filter: (interaction) => {
          interaction.deferUpdate();
          return interaction.user.id === interaction.user.id;
        },
      })
      .catch((e) => {
        timeout = true;
      });
    if (!response) break;
    if (
      "item" === response.customId &&
      response instanceof SelectMenuInteraction
    ) {
      const slot = parseInt(response.values[0]);
      item = sender.inventory[slot];
    }
    if (
      "recipient" === response.customId &&
      response instanceof SelectMenuInteraction
    ) {
      const character = getCharacter(response.values[0]);
      if (character) recipient = character;
    }
    if ("send" === response.customId) {
      send = Boolean(item && recipient);
    }
    if ("cancel" === response.customId) {
      cancel = true;
    }
  }
  if (send && sender && recipient && item && item.id) {
    if (
      giveItem({
        sender,
        recipient,
        item,
      })
    ) {
      interaction.followUp(
        `${sender.name} gave ${item.name} to ${recipient.name}.`
      );
    } else {
      interaction.followUp(`Failed to give ${item.name} to ${recipient.name}.`);
    }
  }
};
