import adventure from "./adventure";
import attack from "./attack";
import cooldowns from "./cooldowns";
import crown from "./crown";
import dance from "./dance";
import lootme from "./lootme";
import db from "./db";
import equip from "./equip";
import heal from "./heal";
import hp from "./hp";
import hpbartest from "../character/hpBar/hpbartest";
import inspect from "./inspect";
import inventory from "./inventory";
import list from "./list/list";
import monster from "./monster";
import quest from "./quest";
import quests from "./quests";
import renew from "./renew";
import set from "./set";
import shop from "./shop";
import admin from "./admin";
import chest from "./chest";

const commands = new Map();
commands.set("adventure", adventure);
commands.set("attack", attack);
commands.set("cooldowns", cooldowns);
commands.set("dance", dance);
commands.set("db", db);
commands.set("equip", equip);
commands.set("heal", heal);
commands.set("hp", hp);
commands.set("inspect", inspect);
commands.set("inventory", inventory);
commands.set("list", list);
commands.set("quests", quests);
commands.set("set", set);

if (process.env.DEV_COMMANDS === "true") {
  console.warn("⚠ DEV COMMANDS LOADED ⚠");
  commands.set("admin", admin);
  commands.set("quest", quest);
  commands.set("chest", chest);
  commands.set("hpbartest", hpbartest);
  commands.set("monster", monster);
  commands.set("renew", renew);
  commands.set("crown", crown);
  commands.set("shop", shop);
  commands.set("lootme", lootme);
}

export default commands;
