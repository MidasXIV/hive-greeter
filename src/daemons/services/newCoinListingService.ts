import Service, { TIME_INTERVAL } from "./serviceInterface";
import { Message } from "discord.js";

export class newCoinListingService implements Service {

  name = "new-coin-listing-service";
  executionInterval = TIME_INTERVAL.SECONDS_30;

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}greet to get a greeting.`;
  }

  async preRegister(): Promise<void> {
    return;
  }

  async register(): Promise<void> {
    console.log("Running new coin listing deamon");
    return;
  }

  async postRegister(): Promise<void> {
    return;
  }

  onError(): void {
    return;
  }
}
