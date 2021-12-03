import { createMonster } from "./createMonster";
import { getRandomArrayElement } from "../utils/getRandomArrayElement";
import { getRandomMonsterName } from "./names/getRandomMonsterName";
import { getRoamingMonsters } from "./getRoamingMonsters";
import { isMonster, Monster } from "./Monster";

export const getRandomMonster = async (): Promise<Monster> => {
  const roamingMonsters = getRoamingMonsters();
  if (roamingMonsters.length && Math.random() <= roamingMonsters.length / 10) {
    console.log("returning existing monster");
    const monster = getRandomArrayElement(roamingMonsters);
    if (monster && isMonster(monster)) return monster;
  }
  const rand = Math.random();
  console.log("spawning new monster");
  switch (true) {
    case rand > 0.9:
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
    case rand > 0.6:
      return createMonster({
        name: getRandomMonsterName("Orc"),
        profile: "https://i.imgur.com/2cT3cLm.jpeg",
        gold: Math.floor(Math.random() * 6) + 2,
        isMonster: true,
      });
    case rand > 0.3:
      return createMonster({
        hp: 8,
        maxHP: 8,
        name: getRandomMonsterName("Bandit"),
        profile: "https://i.imgur.com/MV96z4T.png",
        xpValue: 4,
        gold: Math.floor(Math.random() * 5) + 1,
        isMonster: true,
      });
    default:
      return createMonster({
        hp: 5,
        maxHP: 5,
        name: getRandomMonsterName("Goblin"),
        profile: "https://i.imgur.com/gPH1JSl.png",
        xpValue: 3,
        gold: Math.floor(Math.random() * 3) + 1,
        isMonster: true,
      });
  }
};

// (async function () {
//   for (let index = 0; index < 5; index++) {
//     const monster = await getRandomMonster();
//     console.log("Monster name: ", monster.name);
//   }
// })();
