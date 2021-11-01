import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { getDBJSON, loadDB, saveDB } from "../db";

// TODO: require permissions
export const command = new SlashCommandBuilder()
  .setName("db")
  .setDescription("Admin commands")
  .addSubcommand((option) =>
    option.setName("dump").setDescription("Dump the database to screen.")
  )
  .addSubcommand((option) =>
    option.setName("save").setDescription("Save the database to disk.")
  )
  .addSubcommand((option) =>
    option.setName("load").setDescription("Load the database from disk.")
  );

type CommandHandler = (interaction: CommandInteraction) => Promise<void>;

const subcommands = new Map<string, CommandHandler>();

subcommands.set("save", async (interaction: CommandInteraction) => {
  try {
    await saveDB();
    await interaction.reply("Database saved successfully.");
  } catch (e) {
    await interaction.reply("Database save FAILED.");
  }
});

subcommands.set("load", async (interaction: CommandInteraction) => {
  try {
    await loadDB();
    await interaction.reply("Database loaded successfully.");
  } catch (e) {
    await interaction.reply(`Database load FAILED. ${e}`);
  }
});

subcommands.set("dump", async (interaction: CommandInteraction) => {
  await interaction.reply({
    embeds: [
      new MessageEmbed().setDescription("Database").addFields([
        {
          name: "data",
          value: `\`\`\`${getDBJSON(2)}\`\`\``,
        },
      ]),
    ],
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
