import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageAttachment, Permissions } from "discord.js";
import { saveDB } from "../db";
import { DB_FILE } from "../fixtures";
import { CommandHandler } from "../utils";

export const command = new SlashCommandBuilder()
  .setName("db")
  .setDescription("Database Administration")
  .addSubcommand((option) =>
    option.setName("dump").setDescription("Dump the database to screen.")
  )
  .addSubcommand((option) =>
    option.setName("save").setDescription("Save the database to disk.")
  );

const subcommands = new Map<string, CommandHandler>();

subcommands.set("save", async (interaction: CommandInteraction) => {
  if (!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
    await interaction.editReply("Admin required.");
    return;
  }
  try {
    saveDB();
    await interaction.editReply("Database saved successfully.");
  } catch (e) {
    await interaction.editReply("Database save FAILED.");
  }
});

subcommands.set("dump", async (interaction: CommandInteraction) => {
  if (!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
    await interaction.editReply("Admin required.");
    return;
  }
  await interaction.editReply({
    files: [new MessageAttachment(DB_FILE)],
  });
});

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const command = subcommands.get(interaction.options.getSubcommand(true));
  if (!command) {
    await interaction.editReply(`Unknown command ${command}`);
    return;
  }
  await command(interaction);
};

export default { command, execute };
