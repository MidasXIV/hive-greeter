import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { REST } from "@discordjs/rest";
import express, { Request, Response } from "express";
import Discord, { Intents } from "discord.js";
import { exit } from "process";
import { Routes } from "discord-api-types/v9";
import commands from "./commands";
import { loadDB, saveDB } from "./gameState";

if (!process.env.token) exit(1);

loadDB().then(() => console.log("database loaded"));

const rest = new REST({ version: "9" }).setToken(process.env.token);
(async () => {
  if (!process.env.token || !process.env.CLIENT_ID || !process.env.GUILD_ID)
    return;
  try {
    const body = Array.from(commands.values()).map(({ command }) =>
      command.toJSON()
    );
    console.log("Updating commands", body);
    console.time("updating commands");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body,
      }
    );
    console.timeEnd("updating commands");
  } catch (error) {
    console.log(error);
  }
})();

const PORT = process.env.PORT || 5000;

const app = express();
const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

// express server for uptime robots
app.use("/", (request: Request, response: Response) => {
  response.sendStatus(200);
});

client.on("ready", () => {
  console.log("Adventures begin!");
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  console.log("interactionCreate");
  console.time(interaction.commandName);
  try {
    await commands.get(interaction.commandName).execute(interaction);
  } catch (e) {
    await interaction.reply(`Command failed: ${e} - ${interaction.command}`);
  }
  console.timeEnd(interaction.commandName);
});
client.on("error", (e) => {
  console.error("Discord client error!", e);
});

client.login(process.env.token);
app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));

const autoSaveDbFile = "./db.autosave.json";

setInterval(() => {
  console.error(`Auto saving to ${autoSaveDbFile}.`);
  saveDB(autoSaveDbFile);
}, 5 * 60000);

// ["beforeExit", "exit", "uncaughtException", "SIGINT"].map((command) => {
//   process.on(command, (code) => {
//     console.error(
//       `Cleaning up due to ${command}. Saving db to ${autoSaveDbFile}.`,
//       code
//     );
//     saveDB(autoSaveDbFile);
//   });
// });
