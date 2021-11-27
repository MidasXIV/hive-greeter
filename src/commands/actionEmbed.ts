import { CommandInteraction, MessageEmbed } from "discord.js";
import { Character } from "../character/Character";
import { cooldownRemainingText } from "../character/cooldownRemainingText";
import { Emoji } from "../Emoji";

export function actionEmbed({
  character,
  interaction,
}: {
  character: Character;
  interaction: CommandInteraction;
}): MessageEmbed {
  return new MessageEmbed({
    title: "Actions",
    fields: [
      {
        name: "Attack",
        value:
          Emoji(interaction, "attack") +
          " " +
          cooldownRemainingText(character.id, "attack"),
        inline: true,
      },
      {
        name: "Adventure",
        value:
          Emoji(interaction, "adventure") +
          " " +
          cooldownRemainingText(character.id, "adventure"),
        inline: true,
      },
      {
        name: "Heal",
        value:
          Emoji(interaction, "heal") +
          " " +
          cooldownRemainingText(character.id, "adventure"),
        inline: true,
      },
    ],
  });
}
