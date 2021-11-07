import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageAttachment, Permissions } from "discord.js";
import { DB_FILE, loadDB, saveDB } from "../gameState";
import { CommandHandler } from "../utils";

export const command = new SlashCommandBuilder()
  .setName("db")
  .setDescription("Database Administration")
  .addSubcommand((option) =>
    option.setName("dump").setDescription("Dump the database to screen.")
  )
  .addSubcommand((option) =>
    option.setName("save").setDescription("Save the database to disk.")
  )
  .addSubcommand((option) =>
    option.setName("load").setDescription("Load the database from disk.")
  );

const subcommands = new Map<string, CommandHandler>();

subcommands.set("save", async (interaction: CommandInteraction) => {
  if (!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
    return await interaction.reply("Admin required.");
  }
  try {
    await saveDB();
    await interaction.reply("Database saved successfully.");
  } catch (e) {
    await interaction.reply("Database save FAILED.");
  }
});

subcommands.set("load", async (interaction: CommandInteraction) => {
  if (!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
    return await interaction.reply("Admin required.");
  }
  try {
    await loadDB();
    await interaction.reply("Database loaded successfully.");
  } catch (e) {
    await interaction.reply(`Database load FAILED. ${e}`);
  }
});

subcommands.set("dump", async (interaction: CommandInteraction) => {
  if (!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
    return await interaction.reply("Admin required.");
  }
  await interaction.reply({
    files: [new MessageAttachment(DB_FILE)],
  });
});

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const command = subcommands.get(interaction.options.getSubcommand(true));
  if (!command) return await interaction.reply(`Unknown command ${command}`);
  await command(interaction);
};

export default { command, execute };
