import Command from "../commandInterface";
import { Message } from "discord.js";
import Binance from 'binance-api-node'

export class BinanceAllCoins implements Command {
  commandNames = ["coins"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}coins to get a list of all coins from binance.`;
  }

  async run(message: Message): Promise<void> {
    const client = Binance();
    const pairs = await client.prices();
    const pairingBase = "USDT"
    const prices = Object.keys(pairs).reduce((acc, pair) => {
      if(!pair.endsWith(pairingBase)) {
        delete acc[pair]
      }
      return acc;
    }, pairs);
    console.log(prices);
    await message.reply(JSON.stringify(prices));
  }
}
