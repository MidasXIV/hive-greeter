import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import {
  adjustHP,
  getUserCharacter,
  isCharacterOnCooldown,
  levelup,
  setCharacterCooldown,
  trap,
} from "../db";
import { sleep } from "../utils";

export const command = new SlashCommandBuilder()
  .setName("adventure")
  .setDescription("Set off in search of glory.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const initiator = interaction.user;
  const roll = Math.random();
  const player = getUserCharacter(initiator);
  if (player.hp === 0) {
    await interaction.reply({
      embeds: [
        new MessageEmbed().setDescription(`You're too weak to press on.`),
      ],
    });
    return;
  }
  if (isCharacterOnCooldown(player.id)) {
    await interaction.reply({
      embeds: [new MessageEmbed().setDescription(`You can't do that yet.`)],
    });
  }
  setCharacterCooldown(initiator.id);
  if (roll >= 0.95) {
    levelup(initiator.id);
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(
            `You encounter a divine entity that blesses you with +1 max hp!`
          )
          .setImage("https://imgur.com/psnFPYG.png"),
      ],
    });
    return;
  }
  if (roll >= 0.8) {
    const healAmount = Math.floor(Math.random() * 6);
    adjustHP(initiator.id, healAmount);
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(
            `You drink from a fairy's well, it heals you for ${healAmount}!`
          )
          .setImage("https://imgur.com/bgq63v9.png"),
      ],
    });
    return;
  }
  if (roll >= 0.3) {
    const message = await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(`It's a trap!`)
          .setImage("https://imgur.com/TDMLxyE.png"),
      ],
      fetchReply: true,
    });
    if (!(message instanceof Message)) return;
    const result = trap(initiator.id);
    // await interaction.reply(`It's a trap! ...`);
    await sleep(2000);
    switch (result.outcome) {
      case "hit":
        await interaction.followUp({
          embeds: [
            new MessageEmbed()
              .setDescription(`You're hit! You take ${result.damage} damage!`)
              .setImage("https://imgur.com/28oehQm.png"),
          ],
        });
        break;
      case "miss":
        await interaction.followUp({
          embeds: [
            new MessageEmbed()
              .setDescription(`You deftly evade!`)
              .setImage("https://imgur.com/gSgcrnN.png"),
          ],
        });
        break;
    }
    return;
  }
  await interaction.reply({
    embeds: [
      new MessageEmbed()
        .setDescription(`You travel the lands.`)
        .setImage("https://imgur.com/WCVVyh6.png"),
    ],
  });
};

export default { command, execute };
