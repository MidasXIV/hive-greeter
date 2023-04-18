import { GreetCommand, TimeCommand, BinanceAllCoins, FetchEconomicEventsCommand } from "./commands";
import Command from "./commands/commandInterface";

import {
  ChatInputCommandInteraction,
  Collection,
  Interaction
} from "discord.js";

export default class CommandHandler {
  private commands = new Collection<string, Command>();

  private readonly prefix: string;

  constructor(prefix: string) {
    const commandClasses = [GreetCommand, TimeCommand, BinanceAllCoins, FetchEconomicEventsCommand];

    for (const commandClass of commandClasses) {
      const command = new commandClass();
      if ("data" in command && "execute" in command) {
        this.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command ${commandClass} is missing a required "data" or "execute" property.`
        );
      }
    }
    this.prefix = prefix;
  }

  /** Executes user commands contained in a message if appropriate. */
  async handleMessage(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const command = this.commands.get(interaction.commandName);

    if (!command) {
      await interaction.reply(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction as ChatInputCommandInteraction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content:
            "There was an error while executing this command! failed because of ${error}",
          ephemeral: true,
        });
      }
    }
  }
}
