import { Message } from "discord.js";

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
  SECONDS_30 : 30 * 1000,
  SECONDS_60 : 60 * 1000,
}
