import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { trapAttack as trapAttack } from "../trap/trapAttack";
import { sleep } from "../utils";
import { updateUserQuestProgess } from "../quest/updateQuestProgess";
import { awardXP } from "../character/awardXP";
import { trapRollText } from "../trap/trapRollText";
import { xpGainField } from "../character/xpGainField";

export const trap = async (interaction: CommandInteraction): Promise<void> => {
  const message = await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: "Trap!",
        color: "RED",
        description: `It's a trap!`,
      }).setImage("https://imgur.com/TDMLxyE.png"),
    ],
  });
  if (!(message instanceof Message)) return;
  const result = trapAttack(interaction.user.id);
  if (!result) {
    await interaction.editReply("No result. This should not happen.");
    return;
  }
  await sleep(2000);
  const character = getUserCharacter(interaction.user);
  switch (result.outcome) {
    case "hit":
      awardXP(interaction.user.id, 1);
      if (character.hp > 0)
        updateUserQuestProgess(interaction.user, "survivor", result.damage);
      await interaction.followUp({
        embeds: [
          new MessageEmbed({
            color: "RED",
            description: `You're hit! You take ${result.damage} damage!`,
            fields: [xpGainField(interaction, 1)],
          })
            .addField("Roll", trapRollText(result))
            .setImage("https://imgur.com/28oehQm.png"),
        ],
      });
      break;
    case "miss":
      awardXP(interaction.user.id, 2);
      await interaction.followUp({
        embeds: [
          new MessageEmbed({
            description: `You deftly evade!`,
          })
            .addField("Roll", trapRollText(result))
            .addFields([xpGainField(interaction, 2)])
            .setImage("https://imgur.com/gSgcrnN.png"),
        ],
      });
      break;
  }
};
