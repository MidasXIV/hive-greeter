import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageSelectMenu,
} from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { isEquippable } from "./equipment";
import { itemEmbed } from "./itemEmbed";
import { Item } from "./Item";
import { equipItem } from "../character/equipItem";
import { updateCharacter } from "../character/updateCharacter";

export const equipPrompt = async (
  interaction: CommandInteraction,
  isFollowUp = false
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  const message = await interaction[isFollowUp ? "followUp" : "reply"]({
    content: "What would you like to equip?",
    embeds: character.inventory.map((item) => itemEmbed({ item, interaction })),
    components: [
      new MessageActionRow({
        components: [equipOptions(character.inventory)],
      }),
    ],
    fetchReply: true,
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

const equipOptions = (inventory: Item[]) =>
  new MessageSelectMenu()
    .setCustomId("item")
    .setPlaceholder("What would you like to equip?")
    .addOptions(
      inventory.filter(isEquippable).map((item, i) => ({
        label: item.name,
        description: item.description,
        value: i.toString(),
      }))
    );
