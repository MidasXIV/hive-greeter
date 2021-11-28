import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { equipInventoryItemPrompt } from "../equipment/equipInventoryItemPrompt";
import { itemEmbed } from "../equipment/itemEmbed";
import { offerItemPrompt as offerItemPrompt } from "../equipment/offerItemPrompt";

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
      itemEmbed({ item, interaction, showEquipStatus: true })
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
            customId: "offer",
            style: "PRIMARY",
            label: "Offer",
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
  if (reply.customId === "equip") {
    await equipInventoryItemPrompt(interaction);
  }
  if (reply.customId === "offer") {
    await offerItemPrompt(interaction);
  }
};

export default { command, execute };
