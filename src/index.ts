import express, { Request, Response } from 'express';
import Discord, { Message } from "discord.js";
import { DISCORD_TOKEN } from './config/secrets';

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

//////////////////////////////////////////////////////////////////
//                    DISCORD CLIENT LISTENERS                  //
//////////////////////////////////////////////////////////////////
client.on("ready", () => { console.log("Hive Greeter has started"); });
client.on("message", (message: Message) => { message.reply(`Hive Greeter recieved '${message.content} from '${message.author}`); });
client.on("error", e => { console.error("Discord client error!", e); });

client.login(DISCORD_TOKEN);
app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
