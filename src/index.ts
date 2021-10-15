import express, { Request, Response } from 'express';
import Discord, { Message , TextChannel } from "discord.js";
import { DISCORD_TOKEN } from './config/secrets';
import CommandHandler from './commandHandler';
import config from './config/botConfig';
import DaemonHandler from './daemons';

const PORT = process.env.PORT || 5000;

const app = express();
const client = new Discord.Client();

//////////////////////////////////////////////////////////////////
//             EXPRESS SERVER SETUP FOR UPTIME ROBOT            //
//////////////////////////////////////////////////////////////////
app.use(express.urlencoded({ extended: true }));

app.use('/', (request: Request, response: Response) => {
  response.sendStatus(200);
});

const commandHandler = new CommandHandler(config.prefix);

//////////////////////////////////////////////////////////////////
//                    DISCORD CLIENT LISTENERS                  //
//////////////////////////////////////////////////////////////////
// Discord Events: https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate

client.on("ready", async () => {
  const botHealthChannel = await client.channels.fetch(config['bot-health-channel']) as TextChannel ;
  console.log("Starting");
  await botHealthChannel?.send("Hive Greeter has started");
  const daemonHandler = new DaemonHandler(client);
  daemonHandler.register();

});
client.on("message", (message: Message) => { commandHandler.handleMessage(message); });
client.on("error", e => { console.error("Discord client error!", e); });

client.login(DISCORD_TOKEN);
app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
