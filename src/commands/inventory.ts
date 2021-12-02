import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageOptions,
} from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { equipInventoryItemPrompt } from "../equipment/equipInventoryItemPrompt";
import { isTradeable } from "../equipment/equipment";
import { equippableInventory } from "../equipment/equippableInventory";
import { itemEmbed } from "../equipment/itemEmbed";
import { offerItemPrompt as offerItemPrompt } from "../equipment/offerItemPrompt";

export const command = new SlashCommandBuilder()
  .setName("inventory")
  .setDescription("View your inventory.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  console.log(`${character.name}'s inventory`, character.inventory);
  if (!character.inventory.length) {
    await interaction.followUp("Your inventory is empty.");
    return;
  }
  const message = await interaction.followUp({
    ...inventoryMain(interaction),
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;
  let done = false;
  while (!done) {
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
    if (reply.customId === "equip") await equipInventoryItemPrompt(interaction);
    if (reply.customId === "offer") await offerItemPrompt(interaction);
    if (reply.customId === "done") done = true;
    message.edit(inventoryMain(interaction));
  }
  message.edit({ components: [] });
};

export default { command, execute };

function inventoryMain(interaction: CommandInteraction): MessageOptions {
  const character = getUserCharacter(interaction.user);
  const hasItemsToOffer = character.inventory.filter(isTradeable).length > 0;
  const hasItemsToEquip = equippableInventory(character).length > 0;

  const components = [];
  if (hasItemsToEquip)
    components.push(
      new MessageButton({
        customId: "equip",
        style: "SECONDARY",
        label: "Equip",
      })
    );
  if (hasItemsToOffer)
    components.push(
      new MessageButton({
        customId: "offer",
        style: "SECONDARY",
        label: "Offer",
      })
    );

  components.push(
    new MessageButton({
      customId: "done",
      style: "SECONDARY",
      label: "Done",
    })
  );

  return {
    embeds: character.inventory.map((item) =>
      itemEmbed({ item, interaction, showEquipStatus: true })
    ),
    components: [
      new MessageActionRow({
        components,
      }),
    ],
  };
}
