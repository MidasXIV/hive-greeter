import adventure from "./adventure";
import attack from "./attack";
import heal from "./heal";
import hp from "./hp";
import inspect from "./inspect";
import monster from "./monster";

const commands = new Map();
commands.set("attack", attack);
commands.set("hp", hp);
commands.set("heal", heal);
commands.set("adventure", adventure);
commands.set("monster", monster);
commands.set("inspect", inspect);
export default commands;
