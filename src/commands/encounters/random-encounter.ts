import { CommandInteraction } from "discord.js";
import { divineBlessing } from "./divine-blessing";
import { fairyWell } from "./fairy-well";
import { monster } from "./monster";
import { trap } from "./trap";
import { travel } from "./travel";

type CommandHandler = (interaction: CommandInteraction) => Promise<void>;
type EncounterId =
  | "fairyWell"
  | "divineBlessing"
  | "trap"
  | "travel"
  | "monster";

type Encounters = {
  [key in EncounterId]: CommandHandler;
};

const encounters: Encounters = {
  divineBlessing,
  fairyWell,
  trap,
  travel,
  monster,
};

type randomEncounter = CommandHandler;
export const randomEncounter = (): CommandHandler => {
  const rand = Math.random();
  switch (true) {
    case rand >= 0.95:
      return encounters["divineBlessing"];
    case rand >= 0.8:
      return encounters["fairyWell"];
    case rand >= 0.6:
      return encounters["monster"];
    case rand >= 0.2:
      return encounters["trap"];
    default:
      return encounters["travel"];
  }
};
