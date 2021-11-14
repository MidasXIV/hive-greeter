import { CommandInteraction, MessageEmbed } from "discord.js";
import { getMonsters } from "../../character/getMonsters";
import { monsterEmbed } from "../encounters/monsterEmbed";

export function listMonsters(interaction: CommandInteraction): void {
  const monsters = Array.from(getMonsters().values());
  interaction.reply({
    embeds: [
      new MessageEmbed({ title: "Recently encountered monsters" }),
      ...(monsters.length > 0
        ? monsters.slice(0, 10).map((monster) => monsterEmbed(monster))
        : [
            new MessageEmbed({
              description:
                "No monsters encountered yet. `/adventure` to find some!",
            }),
          ]),
    ],
  });
}
