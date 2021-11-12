import adventure from "./adventure";
import attack from "./attack";
import cooldowns from "./cooldowns";
import dance from "./dance";
import db from "./db";
import equip from "./equip";
import heal from "./heal";
import hp from "./hp";
import hpbartest from "../character/hpbartest";
import inspect from "./inspect";
import inventory from "./inventory";
import list from "./list";
import monster from "./monster";
import quest from "./quest";
import quests from "./quests";
import renew from "./renew";
import set from "./set";
import shop from "./shop";

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
commands.set("shop", shop);

if (process.env.ADMIN_COMMANDS === "true") {
  console.warn("⚠ ADMIN COMMANDS LOADED ⚠");
  commands.set("quest", quest);
  commands.set("hpbartest", hpbartest);
  commands.set("monster", monster);
  commands.set("renew", renew);
}

export default commands;
