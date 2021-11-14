export function getRandomMapItem<K, V>(iterable: Map<K, V>): V | undefined {
  return iterable.get(
    [...iterable.keys()][Math.floor(Math.random() * iterable.size)]
  );
}
