import { createMonster } from "./createMonster";
import { Monster } from "./Monster";

export const getRandomMonster = (): Monster => {
  const rand = Math.random();
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
