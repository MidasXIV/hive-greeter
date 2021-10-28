// display a player's current health
import Command from "./commandInterface";
import { Message } from "discord.js";
import { attack, getHP } from "../db";

export class AttackCommand implements Command {
  commandNames = ["attack"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}attack @player to roll an attack! ⚔`;
  }

  async run(message: Message): Promise<void> {
    const [defender] = [...message.mentions.users.values()];
    if (!defender) {
      await message.reply(`You must specify a target @player`);
      return;
    }
    console.time("attack");
    if (attack(message.author.id, defender.id)) {
      await message.reply(`Hit! They're now at ${getHP(defender.id)}`);
    } else {
      await message.reply(`Miss! They're still at ${getHP(defender.id)}`);
    }
    console.timeEnd("attack");
  }
}
