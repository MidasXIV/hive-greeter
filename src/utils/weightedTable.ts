import { weightedRandom } from "./weightedRandom";

type WeightedTable<T> = [number, T][];

export const weightedTable = <T>(table: WeightedTable<T>): T => {
  const options = table.map((x) => x[1]);
  const weights = table.map((x) => x[0]);
  return options[weightedRandom(weights)];
};
