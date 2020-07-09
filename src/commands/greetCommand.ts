import Command from "./commandInterface";
import { Message } from "discord.js";

export class GreetCommand implements Command {
  commandNames = ["greet", "hello"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}greet to get a greeting.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply("hello, User!");
  }
}
