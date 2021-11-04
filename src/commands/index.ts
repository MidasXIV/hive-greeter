import db from "./db";
import adventure from "./adventure";
import attack from "./attack";
import heal from "./heal";
import inspect from "./inspect";
import set from "./set";
import dance from "./dance";

const commands = new Map();
commands.set("attack", attack);
commands.set("heal", heal);
commands.set("adventure", adventure);
commands.set("inspect", inspect);
commands.set("set", set);
commands.set("db", db);
commands.set("dance", dance);
export default commands;
