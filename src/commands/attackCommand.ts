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
    const result = attack(message.author.id, defender.id);

    switch (result.outcome) {
      case "hit":
        await message.reply(
          `You hit ${defender.username} for ${result.damage}! ${
            defender.username
          } is now at ${getHP(defender.id)}.`
        );
        if (getHP(defender.id) <= 0) {
          await message.reply(`${defender.username} is unconcious!`);
        }
        break;
      case "miss":
        await message.reply(
          `Miss! ${defender.username} is still at ${getHP(defender.id)}.`
        );
        break;
      case "cooldown":
        await message.reply(`You can't do that yet.`);
        break;
    }

    console.timeEnd("attack");
  }
}
