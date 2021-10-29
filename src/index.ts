import { REST } from "@discordjs/rest";
import { SlashCommandBuilder } from "@discordjs/builders";
import express, { Request, Response } from "express";
import Discord, { Intents, Message } from "discord.js";
import { DISCORD_TOKEN } from "./config/secrets";
import CommandHandler from "./commandHandler";
import config from "./config/botConfig";
import { exit } from "process";
import { Routes } from "discord-api-types/v9";
import commands from "./commands2";

if (!process.env.token) exit();

const rest = new REST({ version: "9" }).setToken(process.env.token);
(async () => {
  if (!process.env.token || !process.env.CLIENT_ID || !process.env.GUILD_ID)
    return;
  try {
    console.log("Updating commands");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: Object.values(commands).map(({ command }) => command.toJSON()),
      }
    );
    console.log("Updating commands complete");
  } catch (error) {
    console.log(error);
  }
})();

const PORT = process.env.PORT || 5000;

const app = express();
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS] });

//////////////////////////////////////////////////////////////////
//             EXPRESS SERVER SETUP FOR UPTIME ROBOT            //
//////////////////////////////////////////////////////////////////
app.use("/", (request: Request, response: Response) => {
  response.sendStatus(200);
});

const commandHandler = new CommandHandler(config.prefix);

//////////////////////////////////////////////////////////////////
//                    DISCORD CLIENT LISTENERS                  //
//////////////////////////////////////////////////////////////////
// Discord Events: https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate

client.on("ready", () => {
  console.log("Zaxnyd bot lives!");
});
client.on("message", (message: Message) => {
  commandHandler.handleMessage(message);
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName == "attack") {
    await commands.attack.execute(interaction);
  }
  // await interaction.reply("Pong!");
});
client.on("error", (e) => {
  console.error("Discord client error!", e);
});

client.login(DISCORD_TOKEN);
app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
