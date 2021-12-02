import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { CommandHandler, sleep } from "../../utils";
import { weightedRandom } from "../../utils/weightedRandom";
import { barFight } from "./barFight";
import { chattyTavernkeepers } from "./chattyTavernkeepers";
import { restfulNight } from "./restfulNight";

const weights = { restfulNight: 1, barFight: 1, chattyTavernkeepers: 1 };
const items: CommandHandler[] = [restfulNight, barFight, chattyTavernkeepers];

const randomEncounter = (): CommandHandler =>
  items[weightedRandom(Object.values(weights))];

export const tavern = async (
  interaction: CommandInteraction
): Promise<void> => {
  const message = await interaction.editReply({
    embeds: [
      new MessageEmbed()
        .setTitle("Tavern")
        .setColor("#964B00")
        .setDescription(
          `You find a tavern and hope for a soft bed, warm meal, and strong drink...`
        )
        .setImage("https://i.imgur.com/AbNnc7S.png"),
    ],
  });
  if (!(message instanceof Message)) return;
  await sleep(2000);
  await randomEncounter()(interaction);
};
