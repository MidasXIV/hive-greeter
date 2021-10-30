import adventure from "./adventure";
import attack from "./attack";
import heal from "./heal";
import hp from "./hp";

const commands = new Map();
commands.set("attack", attack);
commands.set("hp", hp);
commands.set("heal", heal);
commands.set("adventure", adventure);
export default commands;
