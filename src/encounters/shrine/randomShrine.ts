import { CommandHandler } from "../../utils";
import { weightedTable } from "../../utils/weightedTable";
import { armorShrine } from "./armor";
import { attackShrine } from "./attack";
import { slayerShrine } from "./slayer";
import { vigorShrine } from "./vigor";

export const randomShrine = (): CommandHandler =>
  weightedTable([
    [1, armorShrine],
    [1, attackShrine],
    [1, slayerShrine],
    [1, vigorShrine],
  ]);
