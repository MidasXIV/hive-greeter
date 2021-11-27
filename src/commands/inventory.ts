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
import { dropItemPrompt } from "../equipment/dropItemPrompt";
import { giveItemPrompt } from "../equipment/giveItemPrompt";

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
    embeds: character.inventory.map((item) =>
      itemEmbed({ item, interaction, showEqupStatus: true })
    ),
    fetchReply: true,
    components: [
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: "equip",
            style: "PRIMARY",
            label: "Equip",
          }),
          new MessageButton({
            customId: "drop",
            style: "PRIMARY",
            label: "Drop",
          }),
          new MessageButton({
            customId: "give",
            style: "PRIMARY",
            label: "Give",
          }),
        ],
      }),
    ],
  });
  if (!(message instanceof Message)) return;
  const reply = await message
    .awaitMessageComponent({
      time: 30000,
      filter: (i) => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
      },
      componentType: "BUTTON",
    })
    .catch(() => {
      message.edit({
        components: [],
      });
    });
  if (!reply) return;
  message.edit({ components: [] });
  if (reply.customId === "drop") {
    await dropItemPrompt(interaction, character);
  }
  if (reply.customId === "equip") {
    await equipPrompt(interaction);
  }
  if (reply.customId === "give") {
    await giveItemPrompt(interaction);
  }
};

export default { command, execute };
