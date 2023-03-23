import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import BotConfig from "../config/botConfig";
import Command from "./commandInterface";

export class TimeCommand implements Command {
  data = new SlashCommandBuilder()
    .setName("time")
    .setDescription(`Use ${BotConfig.prefix}time to current time.`);

  cooldown = 10;

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const now = new Date();
    interaction
      .reply(`${now.getHours()} : ${now.getMinutes()}`)
      .catch(console.error);
  }
}
