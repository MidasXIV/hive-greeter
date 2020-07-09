import { Message } from "discord.js";

export default class CommandHandler {

  private readonly prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  /** Executes user commands contained in a message if appropriate. */
  async handleMessage(message: Message): Promise<void> {
    if (message.author.bot || !this.isCommand(message)) {
      return;
    }

    message.reply(`Hive Greeter recieved '${this.echoMessage(message)}' from ${message.author.tag}`);
  }

  /** Sends back the message content after removing the prefix. */
  echoMessage(message: Message): string {
    return message.content.replace(this.prefix, "").trim();
  }


  /** Determines whether or not a message is a user command. */
  private isCommand(message: Message): boolean {
    return message.content.startsWith(this.prefix);
  }
}
