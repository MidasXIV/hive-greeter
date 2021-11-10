import { CommandInteraction } from "discord.js";
import { armorShrine } from "./shrine/armor";
import { attackShrine } from "./shrine/attack";
import { divineBlessing } from "./divine-blessing";
import { fairyWell } from "./fairy-well";
import { monster } from "./monster";
import { tavern } from "./tavern";
import { trap } from "./trap";
import { travel } from "./travel";
import { chest } from "./chest";
import { vigorShrine } from "./shrine/vigor";

type CommandHandler = (interaction: CommandInteraction) => Promise<void>;
type EncounterId =
  | "fairyWell"
  | "divineBlessing"
  | "trap"
  | "travel"
  | "monster"
  | "tavern"
  | "attackShrine"
  | "armorShrine"
  | "vigorShrine"
  | "chest";

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
  armorShrine,
  attackShrine,
  chest,
  vigorShrine,
};

type randomEncounter = CommandHandler;
export const randomEncounter = (): CommandHandler => {
  const rand = Math.random();
  switch (true) {
    case rand >= 0.99:
      return encounters["divineBlessing"];
    case rand >= 0.8:
      return encounters["fairyWell"];
    case rand >= 0.7:
      return encounters["armorShrine"];
    case rand >= 0.6:
      return encounters["attackShrine"];
    case rand >= 0.5:
      return encounters["chest"];
    case rand >= 0.4:
      return encounters["monster"];
    case rand >= 0.3:
      return encounters["tavern"];
    case rand >= 0.2:
      return encounters["trap"];
    default:
      return encounters["travel"];
  }
};
