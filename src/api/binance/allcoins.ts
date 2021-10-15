
import Binance from 'binance-api-node'

export const allCoins = async (): Promise<string> => {
  const client = Binance();
  const pairs = await client.prices();
  const pairingBase = "USDT"
  const prices = Object.keys(pairs).reduce((acc, pair) => {
    if(!pair.endsWith(pairingBase)) {
      delete acc[pair]
    }
    return acc;
  }, pairs);
  return JSON.stringify(prices);
}
