import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageEmbed,
  MessageSelectMenu,
} from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { grantQuest } from "../../quest/grantQuest";
import { isQuestId, quests } from "../../quest/quests";
import questsCommand from "../../commands/quests";
import { awardXP } from "../../character/awardXP";
import { updateCharacter } from "../../character/updateCharacter";

// TODO: omit quests the user already has
export const chattyTavernkeepers = async (
  interaction: CommandInteraction,
  replyType: "reply" | "followUp" = "followUp"
): Promise<void> => {
  awardXP(interaction.user.id, 1);
  const message = await interaction[replyType]({
    fetchReply: true,
    files: [new MessageAttachment("./images/Tavernkeepers.jpg")],
    embeds: [
      new MessageEmbed()
        .setTitle("Chatty Tavernkeepers!")
        .setImage("attachment://Tavernkeepers.jpg")
        .setDescription(
          "Turns out they know someone's got a thing needs doing.\n\nCompensation? Of course!"
        )
        .addField("XP Gained", "1"),
    ],
    components: [
      new MessageActionRow({
        components: [
          new MessageSelectMenu()
            .setCustomId("quest")
            .setPlaceholder("So... you in or what?")
            .addOptions(
              Object.values(quests).map((quest) => ({
                label: quest.title,
                value: quest.id,
                description: `${quest.objective}: ${quest.reward}`,
              }))
            ),
        ],
      }),
    ],
  });

  if (!(message instanceof Message)) return;
  const response = await message
    .awaitMessageComponent({
      filter: (i) => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
      },
      componentType: "SELECT_MENU",
      time: 60000,
    })
    .catch(() => {
      interaction.followUp("Another time, perhaps!");
    });
  if (!response) {
    interaction.followUp("Another time, perhaps!");
    return;
  }
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
  await questsCommand.execute(interaction, "followUp");
};
