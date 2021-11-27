import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { itemEmbed } from "../equipment/itemEmbed";
import { equipPrompt } from "../equipment/equipPrompt";
import { dropInventoryItemPrompt } from "../equipment/dropInventoryItemPrompt";

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
    await equipPrompt(interaction);
  }
};

export default { command, execute };
