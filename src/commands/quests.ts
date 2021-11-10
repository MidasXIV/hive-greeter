import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { getUserCharacter } from "../gameState";
import { progressBar } from "../utils/progress-bar";
import { slayerQuestReward } from "../quest/rewards/slayerQuest";
import { getCompletedQuests } from "../quest/getCompletedQuests";
import { Quest } from "../quest/Quest";
import { isQuestId, QuestId } from "../quest/quests";

export const command = new SlashCommandBuilder()
  .setName("quests")
  .setDescription("Check your quest progress.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);
  const completedQuests = getCompletedQuests(character);
  const embed = new MessageEmbed().setTitle("Quests");
  if (Object.values(character.quests).length === 0) {
    return await interaction.reply(
      `You do not have any active quests. \`/adventure\` to find some!`
    );
  }
  Object.values(character.quests).map((quest) => {
    embed.addField(
      quest.title,
      `${quest.objective}\n${progressBar(
        quest.progress / quest.totalRequired
      )} ${quest.progress}/${quest.totalRequired}`
    );
  });
  const message = await interaction.reply({
    embeds: [embed],
    components: getComponents(completedQuests),
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;
  const reply = await message
    .awaitMessageComponent({
      filter: (i) => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
      },
      componentType: "BUTTON",
    })
    .finally(() => message.edit({ embeds: [embed], components: [] }));
  if (isQuestId(reply.customId))
    await completeQuest(interaction, reply.customId);
};

export default { command, execute };

function getComponents(completedQuests: Map<string, Quest>) {
  if (completedQuests.size > 0) {
    return [
      new MessageActionRow({
        components: Array.from(completedQuests.entries()).map(
          ([id, quest]) =>
            new MessageButton({
              customId: id,
              label: `Turn in ${quest.title} quest`,
              style: "PRIMARY",
            })
        ),
      }),
    ];
  }
  return [];
}

const completeQuest = async (
  interaction: CommandInteraction,
  questId: QuestId
): Promise<void> => {
  switch (questId) {
    case "slayer":
      await slayerQuestReward(interaction);
      break;
    // case 'blessed':
  }
};
