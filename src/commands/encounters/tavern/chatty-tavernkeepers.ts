import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageEmbed,
  MessageSelectMenu,
} from "discord.js";
import {
  adjustHP,
  awardXP,
  d6,
  getUserCharacter,
  updateCharacter,
} from "../../../gameState";
import { grantQuest } from "../../../quest/grantQuest";
import { isQuestId, quests } from "../../../quest/quests";

export const chattyTavernkeepers = async (
  interaction: CommandInteraction
): Promise<void> => {
  const roll = d6();
  awardXP(interaction.user.id, 1);
  adjustHP(interaction.user.id, roll);
  const message = await interaction.reply({
    fetchReply: true,
    files: [new MessageAttachment("./images/Tavernkeepers.jpg")],
    embeds: [
      new MessageEmbed()
        .setTitle("Chatty Tavernkeepers!")
        .setImage("attachment://Tavernkeepers.jpg")
        .setDescription(
          "Turns out they know someone's got a thing needs doing.\n\nCompensation? Of course!"
        ),
    ],
    components: [
      new MessageActionRow({
        components: [
          new MessageSelectMenu()
            .setCustomId("quest")
            .setPlaceholder("So... you in or what?")
            .addOptions(
              Object.entries(quests).map(([id, quest]) => ({
                label: quest.title,
                value: id,
                description: `${quest.objective}: ${quest.reward}`,
              }))
            ),
        ],
      }),
    ],
  });

  if (!(message instanceof Message)) return;
  const response = await message.awaitMessageComponent({
    filter: (i) => {
      i.deferUpdate();
      return i.user.id === interaction.user.id;
    },
    componentType: "SELECT_MENU",
    time: 60000,
  });
  const questId = response.values[0];
  if (!isQuestId(questId)) {
    interaction.followUp(`${questId} is not a valid quest id`);
    return;
  }
  updateCharacter(grantQuest(getUserCharacter(interaction.user), questId));
  console.log(`quest accepted ${questId}`);
  await interaction.followUp(
    `You have been charged with the ${quests[questId].title} quest.`
  );
};
