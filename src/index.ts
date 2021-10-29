import dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import express, { Request, Response } from "express";
import Discord, { Intents } from "discord.js";
import { exit } from "process";
import { Routes } from "discord-api-types/v9";
import commands from "./commands";

dotenv.config({ path: ".env" });

if (!process.env.token) exit(1);

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
        body: Array.from(commands.values()).map(({ command }) =>
          command.toJSON()
        ),
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

//////////////////////////////////////////////////////////////////
//                    DISCORD CLIENT LISTENERS                  //
//////////////////////////////////////////////////////////////////
// Discord Events: https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate

client.on("ready", () => {
  console.log("Zaxnyd bot lives!");
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  await commands.get(interaction.commandName).execute(interaction);
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  await commands.get(interaction.commandName).execute(interaction);
});
client.on("error", (e) => {
  console.error("Discord client error!", e);
});

client.login(process.env.token);
app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
