import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageSelectMenu,
} from "discord.js";
import { updateCharacter } from "../updateCharacter";
import { getUserCharacter } from "../getUserCharacter";
import { Item, itemEmbed, itemIsEquippable } from "../equipment/equipment";
import { equipItem } from "../character/equipItem";

export const command = new SlashCommandBuilder()
  .setName("equip")
  .setDescription("An adventurer must be properly equipped.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  const message = await interaction.reply({
    content: "What would you like to equip?",
    embeds: character.inventory.map(itemEmbed),
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

export default { command, execute };

const equipOptions = (inventory: Item[]) =>
  new MessageSelectMenu()
    .setCustomId("item")
    .setPlaceholder("What would you like to equip?")
    .addOptions(
      inventory.filter(itemIsEquippable).map((item, i) => ({
        label: item.name,
        description: item.description,
        value: i.toString(),
      }))
    );
