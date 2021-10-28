// display a player's current health
import Command from "./commandInterface";
import { Message } from "discord.js";
import { getHP } from "../db";

export class HPCommand implements Command {
  commandNames = ["hp"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}hp to see your current health total.`;
  }

  async run(message: Message): Promise<void> {
    const mentionedIds = [...message.mentions.users.keys()];
    console.time("hp");
    if (mentionedIds[0]) {
      await message.reply(`They have ${getHP(mentionedIds[0])} health points.`);
    } else {
      await message.reply(
        `You have ${getHP(message.author.id)} health points.`
      );
    }
    console.timeEnd("hp");
  }
}
