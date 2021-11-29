import { SlashCommandBuilder } from "@discordjs/builders";
import { randomUUID } from "crypto";
import { CommandInteraction } from "discord.js";
import { getUserCharacters } from "../character/getUserCharacters";
import { updateCharacter } from "../character/updateCharacter";

export const command = new SlashCommandBuilder()
  .setName("admin")
  .setDescription("Administrative functions.")
  .addSubcommand((option) =>
    option
      .setName("apply_item_defaults")
      .setDescription("Apply default properties to any items that lack them.")
  )
  .addSubcommand((option) =>
    option.setName("unequip_all").setDescription("Globally unequip all items.")
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  switch (interaction.options.getSubcommand()) {
    case "apply_item_defaults":
      applyItemDefaults();
      return interaction.reply("Item defaults applied.");
    case "unequip_all":
      unequipAll();
      return interaction.reply("All equipment removed.");
  }
};

const applyItemDefaults = async (): Promise<void> => {
  getUserCharacters().forEach((character) =>
    updateCharacter({
      ...character,
      inventory: character.inventory.map((item) => ({
        ...item,
        id: item.id ?? randomUUID(),
        sellable: item.sellable ?? item.name !== "heavy crown",
        tradeable: item.tradeable ?? item.name !== "heavy crown",
      })),
    })
  );
};

const unequipAll = async (): Promise<void> => {
  getUserCharacters().forEach((character) =>
    updateCharacter({
      ...character,
      equipment: {},
    })
  );
};

export default { command, execute };
