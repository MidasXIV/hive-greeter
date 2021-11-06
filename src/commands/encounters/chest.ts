import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import moment from "moment";
import { grantStatusEffect, StatModifier, trap } from "../../db";

type Chest = {
  isTrapped: boolean;
  isLocked: boolean;
  lockFound: boolean;
  isLooted: boolean;
  trapFound: boolean;
  inspected: boolean;
  unlockAttempted: boolean;
  trapDisarmed: boolean;
  trapDisarmAttempted: boolean;
  trapTriggered: boolean;
};

export const chest = async (interaction: CommandInteraction): Promise<void> => {
  let fled = false;
  let timeout = false;

  const chest: Chest = {
    isTrapped: Math.random() <= 0.7,
    isLocked: Math.random() <= 0.7,
    lockFound: false,
    isLooted: false,
    trapFound: false,
    inspected: false,
    unlockAttempted: false,
    trapDisarmed: false,
    trapDisarmAttempted: false,
    trapTriggered: false,
  };

  const message = await interaction.reply({
    embeds: [chestEmbed(chest)],
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;
  await message.react("👀");
  await message.react("👐");
  await message.react("🏃‍♀️");
  do {
    console.log("from the top");
    const collected = await message
      .awaitReactions({
        filter: (reaction, user) =>
          ["👀", "🔓", "👐", "🏃‍♀️", "⚙"].includes(String(reaction.emoji.name)) &&
          user.id === interaction.user.id,
        max: 1,
        time: 60000,
        errors: ["time"],
      })
      .catch(() => {
        timeout = true;
      });
    if (!collected || timeout) {
      await interaction.followUp(`Timed out`);
      return;
    }
    const reaction = collected.first();
    if (!reaction) {
      await interaction.followUp(`No reaction received.`);
      return;
    }
    console.log(`emoji received ${reaction.emoji.name}`);
    if (reaction.emoji.name === "🏃‍♀️") {
      fled = true;
      break;
    }
    if (reaction.emoji.name === "👀") {
      message.reactions.cache.get("👀")?.remove();
      chest.inspected = true;
      if (chest.isTrapped && Math.random() <= 0.7) {
        chest.trapFound = true;
        await message.react("⚙");
      }
      if (chest.isLocked) {
        chest.lockFound = true;
        await message.react("🔓");
      }
    }
    if (reaction.emoji.name === "⚙") {
      message.reactions.cache.get("⚙")?.remove();
      chest.trapDisarmAttempted = true;
      if (Math.random() <= 0.7) {
        chest.trapDisarmed = true;
      }
    }
    if (reaction.emoji.name === "🔓") {
      message.reactions.cache.get("🔓")?.remove();
      chest.unlockAttempted = true;
      if (chest.isTrapped && Math.random() <= 0.3) {
        chest.trapTriggered = true;
      }
      if (Math.random() <= 0.7) {
        chest.isLocked = false;
        await message.react("👐");
      }
    }
    if (reaction.emoji.name === "👐") {
      if (chest.isTrapped) chest.trapTriggered = true;
      if (!chest.isLocked) chest.isLooted = true;
      if (chest.isLocked) {
        chest.lockFound = true;
        await message.react("🔓");
      }
    }
    const userReactions = message.reactions.cache.filter((reaction) =>
      reaction.users.cache.has(interaction.user.id)
    );

    try {
      for (const reaction of userReactions.values()) {
        await reaction.users.remove(interaction.user.id);
      }
    } catch (error) {
      console.error("Failed to remove reactions.");
    }
    message.edit({
      embeds: [chestEmbed(chest)],
    });
  } while (!chest.isLooted && !fled);
  message.reactions.removeAll();
  if (fled) await message.reply("You decide to leave well enough alone.");
  if (chest.isLooted) await message.reply("You loot the chest!");
};

const chestEmbed = (chest: Chest): MessageEmbed => {
  const embed = new MessageEmbed()
    .setTitle("A chest!")
    .setColor("GOLD")
    .setDescription(`You found a treasure chest! What wonders wait within?`)
    .setImage("https://i.imgur.com/YBafCy2.jpg");

  if (chest.inspected) {
    embed.addField("Inspected", "You inspected the chest.");
    chest.trapFound
      ? embed.addField("Trap!", "You found a trap.")
      : embed.addField("Trap", "You don't _believe_ the chest is trapped...");
  }

  if (chest.trapDisarmAttempted)
    embed.addField(
      "Trap Disarmed",
      "You _believe_ the trap has been disabled...."
    );

  if (chest.lockFound && !chest.isLocked)
    embed.addField("Unlocked", "The chest is unlocked.");
  if (chest.lockFound && chest.isLocked)
    embed.addField("Locked", "The chest is locked.");
  return embed;
};
