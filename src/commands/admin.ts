import { SlashCommandBuilder } from "@discordjs/builders";
import { randomUUID } from "crypto";
import { CommandInteraction } from "discord.js";
import { getUserCharacters } from "../character/getUserCharacters";
import { updateCharacter } from "../character/updateCharacter";

export const command = new SlashCommandBuilder()
  .setName("admin")
  .setDescription("Administrative functions.")
  .addSubcommand((option) =>
    option.setName("apply_item_uuids").setDescription("Apply UUIDs to items")
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  switch (interaction.options.getSubcommand()) {
    case "apply_item_uuids":
      applyItemUuids();
      return interaction.reply("UUIDS applied.");
  }
};

const applyItemUuids = async (): Promise<void> => {
  // for each user, clear equipped items and apply uuids to all inventory items
  getUserCharacters().forEach((character) =>
    updateCharacter({
      ...character,
      equipment: {},
      inventory: character.inventory.map((item) => ({
        ...item,
        id: item.id ?? randomUUID(),
      })),
    })
  );
};

export default { command, execute };
