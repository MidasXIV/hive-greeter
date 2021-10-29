// display a player's current health
import Command from "./commandInterface";
import { Message } from "discord.js";
import { getHP } from "../db";

export class HPCommand implements Command {
  commandNames = ["hp"];

  help(commandPrefix: string): string {
    return `Use \`${commandPrefix}hp\` to see your current health total or \`${commandPrefix}hp @username\` to see someone else's current health.`;
  }

  async run(message: Message): Promise<void> {
    const [who] = [...message.mentions.users.values()];
    console.time("hp");
    if (who) {
      await message.reply(
        `${who.username} has ${getHP(who.id)} health points.`
      );
    } else {
      await message.reply(
        `You have ${getHP(message.author.id)} health points.`
      );
    }
    console.timeEnd("hp");
  }
}
