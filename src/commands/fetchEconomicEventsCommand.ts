import {
  APIEmbedField,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import BotConfig from "../config/botConfig";
import Command from "./commandInterface";
import { EconomicEventsModel } from "../models/EconomicEvents";

const economicEventsModel = new EconomicEventsModel(
  BotConfig["economic-events-api-endpoint"]
);

export class FetchEconomicEventsCommand implements Command {
  data = new SlashCommandBuilder()
    .setName("economic-events")
    .setDescription(`Use To fetch economic events from anavrin`)
    .addStringOption((option) =>
      option
        .setName("impact")
        .setDescription("Only events of high impact")
        .addChoices(
          { name: "High", value: "3" },
          { name: "Medium", value: "2" },
          { name: "Low", value: "1" }
        )
    );

  cooldown = 10;

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    // set thinking state
    await interaction.deferReply();

    const DO_NOT_FILTER_BY_IMPACT = "DO_NOT_FILTER_BY_IMPACT";
    const impact =
      interaction.options.getString("impact") ?? DO_NOT_FILTER_BY_IMPACT;

    let color;
    switch (impact) {
      case "1":
        color = 0x00ff00; // green
        break;
      case "2":
        color = 0xffff00; // yellow
        break;
      case "3":
        color = 0xff0000; // red
        break;
      default:
        color = 0xFFFFFF; // default
    }

    let messageReply;
    try {
      const events = await economicEventsModel.fetchEvents();

      // Create a new embed
      const embed = new EmbedBuilder();
      const eventFields: APIEmbedField[] = [];

      // Set the title of the embed
      embed.setTitle("Economic Events");
      embed.setColor(color);

      // Loop through the events and add fields to the embed
      events.forEach((day) => {
        const eventsForDay = day.events;
        // let field = "";

        const field = eventsForDay
          .filter(
            (event) =>
              impact === DO_NOT_FILTER_BY_IMPACT || event?.impact === impact
          )
          .map(
            (event) =>
              `**${event.release}**\n*${event.time}* | Actual: ${event.actual} | Expected: ${event.expected} | Prior: ${event.prior}\n`
          )
          .join("");

        if (field === "") return;
        eventFields.push({ name: day.day, value: field });
      });
      console.log(eventFields);
      embed.addFields(eventFields);

      messageReply = { embeds: [embed] };
    } catch (err) {
      console.error(err);
      messageReply = "Error in fetching economic events";
    }
    await interaction.editReply(messageReply).catch(console.error);
  }
}
