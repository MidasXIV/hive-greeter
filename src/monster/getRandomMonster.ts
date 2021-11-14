import { gameState } from "../gameState";
import { createMonster } from "./createMonster";
import { getRandomItem } from "./getRandomItem";
import { getRoamingMonsters } from "./getRoamingMonsters";
import { Monster } from "./Monster";

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
    const monster = getRandomItem(getRoamingMonsters());
    if (monster) return monster;
  }
  const rand = Math.random();
  console.log("spawning new monster");
  switch (true) {
    case rand > 0.75:
      return createMonster({
        name: "Green Slime Man",
        hp: 24,
        maxHP: 24,
        ac: 7,
        attackBonus: 0,
        damageBonus: 2,
        damageMax: 4,
        gold: Math.floor(Math.random() * 8) + 3,
        profile:
          "https://dl.airtable.com/.attachmentThumbnails/8f439faeedea2fd168357162ff38d8ec/bb288957",
      });
    case rand > 0.5:
      return createMonster({
        name: "Orc",
        profile: "https://i.imgur.com/2cT3cLm.jpeg",
        gold: Math.floor(Math.random() * 6) + 2,
        isMonster: true,
      });
    case rand > 0.25:
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
