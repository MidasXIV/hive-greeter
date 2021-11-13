import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../../getUserCharacter";
import { trapAttack as trapAttack } from "../../trap/trap";
import { sleep } from "../../utils";
import { updateUserQuestProgess } from "../../quest/updateQuestProgess";
import { awardXP } from "../../character/awardXP";

export const trap = async (interaction: CommandInteraction): Promise<void> => {
  const message = await interaction.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Trap!")
        .setColor("RED")
        .setDescription(`It's a trap!`)
        .setImage("https://imgur.com/TDMLxyE.png"),
    ],
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;
  const result = trapAttack(interaction.user.id);
  if (!result)
    return await interaction.reply("No result. This should not happen.");
  await sleep(2000);
  const character = getUserCharacter(interaction.user);
  switch (result.outcome) {
    case "hit":
      awardXP(interaction.user.id, 1);
      if (character.hp > 0)
        updateUserQuestProgess(interaction.user, "survivor", result.damage);
      await interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(`You're hit! You take ${result.damage} damage!`)
            .addField("Roll", trapRollText(result))
            .addField("XP Gained", "1")
            .setImage("https://imgur.com/28oehQm.png"),
        ],
      });
      break;
    case "miss":
      awardXP(interaction.user.id, 2);
      await interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setDescription(`You deftly evade!`)
            .addField("Roll", trapRollText(result))
            .addField("XP Gained", "2")
            .setImage("https://imgur.com/gSgcrnN.png"),
        ],
      });
      break;
  }
};

const trapRollText = (result: ReturnType<typeof trapAttack>): string =>
  result
    ? `${result.attackRoll}+${result.attackBonus} (${
        result.attackRoll + result.attackBonus
      }) vs ${result.defender.ac} ac${
        result.outcome === "hit" ? ` for ${result.damage} damage` : ""
      }.`
    : "No result";
