// display a player's current health
import Command from "./commandInterface";
import { Message } from "discord.js";

export class HPCommand implements Command {
  commandNames = ["hp"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}hp to see your current health total.`;
  }

  async run(message: Message): Promise<void> {
    console.time("hp");
    const hp = 10;
    await message.reply(`You have ${hp} health points.`);
    console.timeEnd("hp");
  }
}
