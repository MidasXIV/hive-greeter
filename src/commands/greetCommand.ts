import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import BotConfig from "../config/botConfig";
import Command from "./commandInterface";

export class GreetCommand implements Command {
  data = new SlashCommandBuilder()
    .setName("greet")
    .setDescription(`Use ${BotConfig.prefix}greet to greet the user.`);

  cooldown = 10;

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const user = interaction.user;
    const message = `Hello, ${user}!`;

    await interaction.reply(message).catch(console.error);
  }
}