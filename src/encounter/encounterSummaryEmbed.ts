import { CommandInteraction, MessageEmbed } from "discord.js";
import { questProgressField } from "../quest/questProgressField";
import { Monster } from "../monster/Monster";
import { Character } from "../character/Character";
import { Encounter } from "../monster/Encounter";
import { xpGainField } from "../character/xpGainField";
import { Emoji } from "../Emoji";
import { gpGainField } from "../character/gpGainField";

export function encounterSummaryEmbed({
  encounter,
  monster,
  character,
  interaction,
}: {
  encounter: Encounter;
  monster: Monster;
  character: Character;
  interaction: CommandInteraction;
}): MessageEmbed {
  const summary = new MessageEmbed({ title: "Encounter Summary" });

  switch (encounter.outcome) {
    case "double ko":
      summary.addField("Double KO!", `You knocked eachother out!`);
      break;
    case "in progress":
      summary.addField("In Progress", "Encounter in progress.");
      break;
    case "monster fled":
      summary.addField(
        "Evaded!",
        Emoji(interaction, "run") + `${monster.name} escaped!`
      );
      break;
    case "player defeated":
      summary.addField("Unconscious", `${character.name} knocked out!`);
      if (encounter.goldLooted) {
        summary.addField(
          "Looted!",
          `Lost ${Emoji(interaction, "gold")} ${encounter.goldLooted}!`
        );
      }
      break;
    case "player fled":
      summary.addField("Fled", `${character.name} escaped with their life!`);
      break;
    case "player victory":
      summary.addField(
        "Triumphant!",
        `${character.name} defeated the ${monster.name}! 🎉`
      );
      summary.addFields([
        xpGainField(interaction),
        gpGainField(interaction, monster.gold),
      ]);
      if (character && character.quests.slayer)
        summary.addFields([questProgressField(character.quests.slayer)]);
      break;
  }

  return summary;
}
