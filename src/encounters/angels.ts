import { CommandInteraction, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { updateCharacter } from "../character/updateCharacter";
import { questEmbed } from "../commands/questEmbed";
import { grantQuest } from "../quest/grantQuest";

export const angels = async (
  interaction: CommandInteraction,
  isFollowUp = false
): Promise<void> => {
  const character = updateCharacter(
    grantQuest(getUserCharacter(interaction.user), "healer")
  );
  if (!character) return;

  interaction[isFollowUp ? "followUp" : "reply"]({
    embeds: [
      new MessageEmbed({
        title: "Angels",
        color: "WHITE",
        description:
          "An angel implores you to mend what is broken.\nA taste of their power in return is thier token.",
      }).setImage(
        "https://twinfinite.net/wp-content/uploads/2019/06/shb-angel-1.jpg"
      ),
    ].concat(questEmbed(character) ?? []),
  });
};
