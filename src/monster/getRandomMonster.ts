import { gameState } from "../gameState";
import { createMonster } from "./createMonster";
import { Monster } from "./Monster";

const getRandomItem = <K, V>(iterable: Map<K, V>) =>
  iterable.get([...iterable.keys()][Math.floor(Math.random() * iterable.size)]);

export const getRandomMonster = (): Monster => {
  console.log(
    "chance to encounter existing monster",
    gameState.monsters.size / 10
  );
  if (
    gameState.monsters.size &&
    Math.random() <= gameState.monsters.size / 10
  ) {
    console.log("returning existing monster");
    const monster = getRandomItem(gameState.monsters);
    if (monster) return monster;
  }
  const rand = Math.random();
  console.log("spawning new monster");
  switch (true) {
    case rand > 0.6:
      return createMonster({
        name: "Orc",
        profile: "https://i.imgur.com/2cT3cLm.jpeg",
        gold: Math.floor(Math.random() * 6) + 2,
        isMonster: true,
      });
    case rand > 0.3:
      return createMonster({
        hp: 8,
        maxHP: 8,
        name: "Bandit",
        profile: "https://i.imgur.com/MV96z4T.png",
        xpValue: 4,
        gold: Math.floor(Math.random() * 5) + 1,
        isMonster: true,
      });
    default:
      return createMonster({
        hp: 5,
        maxHP: 5,
        name: "Goblin",
        profile: "https://i.imgur.com/gPH1JSl.png",
        xpValue: 3,
        gold: Math.floor(Math.random() * 3) + 1,
        isMonster: true,
      });
  }
};
