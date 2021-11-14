import { CommandInteraction, MessageEmbed } from "discord.js";
import { hpBarField } from "../../character/hpBar/hpBarField";
import { getRoamingMonsters } from "../../monster/getRoamingMonsters";
import { monsterEmbed } from "../encounters/monsterEmbed";

export function listMonsters(interaction: CommandInteraction): void {
  const monsters = getRoamingMonsters();
  interaction.reply({
    embeds: [
      new MessageEmbed({ title: "Monsters at large" }),
      ...(monsters.length > 0
        ? monsters
            .slice(0, 10)
            .map((monster) =>
              monsterEmbed(monster).addFields([hpBarField(monster)])
            )
        : [
            new MessageEmbed({
              description:
                "No monsters encountered yet. `/adventure` to find some!",
            }),
          ]),
    ],
  });
}
