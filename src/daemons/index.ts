import Discord, { TextChannel } from "discord.js";
import { newCoinListingService } from "./services";
import Service from "./services/serviceInterface";
import config from "../config/botConfig";

export default class DaemonHandler {
  private services: Service[];
  private client: Discord.Client;

  constructor(client: Discord.Client) {
    const serviceClasses = [newCoinListingService];
    this.services = serviceClasses.map(
      (serviceClass) => new serviceClass(client)
    );

    this.client = client;
  }

  /**
   *  Public Methods
   */

  /** Registers services */
  register(): void {
    this.services.forEach(async (service) => {
      await this.log(`Registering ${service.name}`);

      try {
        await service?.preRegister?.();
      } catch (e) {
        await this.log(`Error occured in pre-registering ${service.name}`);
        // await this.log(e.toString());
      }

      try {
        setInterval(async () => {
          await service.register();
        }, service.executionInterval);
      } catch (e) {
        await this.log(`Error occured in registering ${service.name}`);
        // await this.log(e.toString());
      }

      try {
        await service?.postRegister?.();
      } catch (e) {
        await this.log(`Error occured in post-registering ${service.name}`);
        // await this.log(e.toString());
      }

      await this.log(`Succesfully registered ${service.name}`);
    });
  }

  /** returns status of a service */
  status(serviceName: string) {
    return;
  }

  clear() {
    // clearInterval([services]);
    return;
  }

  /**
   *  Private Methods
   */

  async log(message: string): Promise<void> {
    const notificationChannel = (await this.client.channels.fetch(
      config["bot-health-channel"]
    )) as TextChannel;
    await notificationChannel?.send(message);
  }
}
