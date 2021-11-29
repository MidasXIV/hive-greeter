console.time("ready");
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { REST } from "@discordjs/rest";
import express, { Request, Response } from "express";
import Discord, { Intents } from "discord.js";
import { exit } from "process";
import { Routes } from "discord-api-types/v9";
import commands from "./commands";
import { saveDB } from "./gameState";

if (!process.env.token) exit(1);

const rest = new REST({ version: "9" }).setToken(process.env.token);

const installCommands = async () => {
  if (!process.env.token || !process.env.CLIENT_ID || !process.env.GUILD_ID)
    return;

  try {
    const body = Array.from(commands.values()).map(({ command }) =>
      command.toJSON()
    );
    // console.log("Updating commands", body);
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
};

async function main() {
  // await loadDB();
  await installCommands();

  const discordClient = new Discord.Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
  });

  const PORT = process.env.PORT || 5000;

  const app = express();

  app.use("/", (request: Request, response: Response) => {
    response.sendStatus(200);
  });

  discordClient.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    console.log("interactionCreate");
    console.time(interaction.commandName);
    try {
      await commands.get(interaction.commandName).execute(interaction);
    } catch (e) {
      await interaction.reply(
        `Command \`${interaction.command}\` failed with error: \`${e}\``
      );
    }
    console.timeEnd(interaction.commandName);
  });
  discordClient.on("error", (e) => {
    console.error("Discord client error!", e);
  });

  discordClient.login(process.env.token);
  app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));

  const autoSaveDbFile = "./db.autosave.json";

  setInterval(() => {
    console.error(`Auto saving to ${autoSaveDbFile}.`);
    saveDB(autoSaveDbFile);
  }, 5 * 60000);
}

main();
