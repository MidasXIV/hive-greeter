import Command from "../commandInterface";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Binance from "binance-api-node";
import BotConfig from "../../config/botConfig";

export class BinanceAllCoins implements Command {
  data = new SlashCommandBuilder()
    .setName("coins")
    .setDescription(
      `Use ${BotConfig.prefix}coins to get a list of all coins from binance.`
    );

  cooldown = 10;

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const client = Binance();
    const pairs = await client.prices();
    const pairingBase = "USDT";
    const prices = Object.keys(pairs).reduce((acc, pair) => {
      if (!pair.endsWith(pairingBase)) {
        delete acc[pair];
      }
      return acc;
    }, pairs);
    console.log(prices);
    await interaction.reply(JSON.stringify(prices));
  }
}
