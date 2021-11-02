import db from "./db";
import adventure from "./adventure";
import attack from "./attack";
import heal from "./heal";
import inspect from "./inspect";
import set from "./set";

const commands = new Map();
commands.set("attack", attack);
commands.set("heal", heal);
commands.set("adventure", adventure);
commands.set("inspect", inspect);
commands.set("set", set);
commands.set("db", db);
// commands.set("dance", dance); // TODO: http://www.gamergeoff.com/images/dancing/halfling%20dance2%20male.gif
export default commands;
