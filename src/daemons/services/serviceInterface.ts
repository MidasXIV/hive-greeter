import Discord, { TextChannel } from "discord.js";
import { Message } from "discord.js";
import config from "../../config/botConfig";

export default interface Service {
  /**
   * List of aliases for the command.
   * The first name in the list is the primary command name.
   */
  readonly name: string;

  readonly executionInterval: number;

  /** Usage documentation. */
  help(commandPrefix: string): string;

  /** Execute the command. */
  preRegister?(): Promise<void>;

  /** Execute the task. */
  register(): Promise<void>;

  /** Execute the command. */
  postRegister?(): Promise<void>;

  /** Error handling */
  onError(): void;
}

export const TIME_INTERVAL = {
  SECONDS_30: 30 * 1000,
  SECONDS_60: 60 * 1000,
}

export abstract class AbstractService {

  private client: Discord.Client;

  constructor(client: Discord.Client) {
    this.client = client;
  }

  async log(message: string | unknown): Promise<void> {
    const notificationChannel = await this.client.channels.fetch(config['bot-health-channel']) as TextChannel;
    await notificationChannel?.send(message);
  }
}