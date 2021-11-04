import { CommandInteraction } from "discord.js";
import { divineBlessing } from "./divine-blessing";
import { fairyWell } from "./fairy-well";
import { monster } from "./monster";
import { tavern } from "./tavern";
import { trap } from "./trap";
import { travel } from "./travel";

type CommandHandler = (interaction: CommandInteraction) => Promise<void>;
type EncounterId =
  | "fairyWell"
  | "divineBlessing"
  | "trap"
  | "travel"
  | "monster"
  | "tavern";

type Encounters = {
  [key in EncounterId]: CommandHandler;
};

const encounters: Encounters = {
  divineBlessing,
  fairyWell,
  trap,
  travel,
  monster,
  tavern,
};

type randomEncounter = CommandHandler;
export const randomEncounter = (): CommandHandler => {
  const rand = Math.random();
  switch (true) {
    case rand >= 0.99:
      return encounters["divineBlessing"];
    case rand >= 0.8:
      return encounters["fairyWell"];
    case rand >= 0.6:
      return encounters["monster"];
    case rand >= 0.4:
      return encounters["tavern"];
    case rand >= 0.2:
      return encounters["trap"];
    default:
      return encounters["travel"];
  }
};
