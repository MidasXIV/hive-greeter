import Discord, { TextChannel } from "discord.js";
import Service, { AbstractService, TIME_INTERVAL } from "./serviceInterface";
import { Message } from "discord.js";
import { allCoins } from "../../api/binance/allcoins";
import loki from "lokijs";

interface pairEntry {
  pair: string,
  price: number
}

interface coinListing {
  [key: string]: number
}
export class newCoinListingService extends AbstractService implements Service {

  name = "new-coin-listing-service";
  executionInterval = TIME_INTERVAL.SECONDS_30;
  coinListing: Collection<any>;
  db: LokiConstructor;

  constructor(client: Discord.Client) {

    super(client);

    this.db = new loki('anavrin.db', {
      autoload: false,
      autosave: true,
      autosaveInterval: 4000 // save every four seconds for our example
    });

    this.coinListing = this.db.getCollection("coin-listing")
    if (this.db.getCollection("coin-listing") === null) {
      this.coinListing = this.db.addCollection("coin-listing")
    }

  }

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}greet to get a greeting.`;
  }

  async preRegister(): Promise<void> {
    return;
  }

  async register(): Promise<void> {
    console.log("Running new coin listing deamon");
    let entryCount = this.coinListing.count();

    const coins: coinListing = await JSON.parse(await allCoins());
    const coinPairings = Object.keys(coins).reduce((acc: Array<pairEntry>, pair: string) => {
      const coinPairing: pairEntry = {
        pair,
        price: coins[pair]
      }
      return [...acc, coinPairing];
    }, []);

    // store coins in database as [{pair: "ETHUSDT", price: 3000}, {}]

    if (entryCount === 0) {
      // database has no data
      this.log("database has no data");
      this.coinListing.insert(coinPairings);
      entryCount = this.coinListing.count();
    }

    coinPairings.forEach(coinPairing => {
      const pairingName = coinPairing.pair;
      const isPairListed = Boolean(this.coinListing.findOne({ pair: pairingName }));
      if (!isPairListed) {
        this.log(`New pair listed on binance : ${pairingName}`);
      }
    });
    return;
  }

  async postRegister(): Promise<void> {
    return;
  }

  onError(): void {
    return;
  }
}
