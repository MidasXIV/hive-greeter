import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { trap as trapAttack } from "../../db";
import { sleep } from "../../utils";

export const trap = async (interaction: CommandInteraction): Promise<void> => {
  const message = await interaction.reply({
    embeds: [
      new MessageEmbed()
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
  switch (result.outcome) {
    case "hit":
      await interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setDescription(`You're hit! You take ${result.damage} damage!`)
            .addField("Roll", trapRollText(result))
            .setImage("https://imgur.com/28oehQm.png"),
        ],
      });
      break;
    case "miss":
      await interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setDescription(`You deftly evade!`)
            .addField("Roll", trapRollText(result))
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
