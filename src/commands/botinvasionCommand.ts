import Command from "./commandInterface";
import { Message } from "discord.js";

const gifUrl =
  "https://media4.giphy.com/media/pIMlKqgdZgvo4/giphy.gif?cid=ecf05e47bjo8bxw0dpavli0ry7kj3uaorkik3m1cw0hmvc1z&rid=giphy.gif&ct=g";

const gifFile = "D:\\Downloads\\botinvasion.gif";

export class BotinvasionCommand implements Command {
  commandNames = ["invade"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}invade to summon a bot invasion.`;
  }

  async run(message: Message): Promise<void> {
    console.time("invade");
    await message.reply("BEEP BOOP THIS IS A TAKEOVER!", {
      files: [gifFile],
    });
    console.timeEnd("invade");
  }
}
