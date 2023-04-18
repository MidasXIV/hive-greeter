import { ApplicationCommandDataResolvable, REST, Routes } from "discord.js";
import { GreetCommand, TimeCommand, BinanceAllCoins, FetchEconomicEventsCommand } from "../commands";
import { DISCORD_TOKEN, GUILD_ID, CLIENT_ID } from "../config/secrets";

const slashCommands = new Array<ApplicationCommandDataResolvable>();

const commandClasses = [GreetCommand, TimeCommand, BinanceAllCoins, FetchEconomicEventsCommand];
for (const commandClass of commandClasses) {
  const command = new commandClass();
  if ("data" in command && "execute" in command) {
    slashCommands.push(command.data.toJSON());
  } else {
    console.warn(
      `[WARNING] The command ${commandClass} is missing a required "data" or "execute" property.`
    );
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN ?? "");

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${slashCommands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID ?? "", GUILD_ID ?? ""),
      { body: slashCommands }
    );

    console.log(
      `Successfully reloaded ${
        (data as Array<unknown>).length
      } application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
