import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export default interface Command {
  /** Name and description of command. */
  data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

  cooldown: number;
  
  /** Execute the command. */
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}