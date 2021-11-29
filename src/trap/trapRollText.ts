import { getCharacterStatModified } from "../character/getCharacterStatModified";
import { trapAttack as trapAttack } from "./trapAttack";

export const trapRollText = (result: ReturnType<typeof trapAttack>): string =>
  result
    ? `${result.attackRoll}+${result.attackBonus} (${
        result.attackRoll + result.attackBonus
      }) vs ${getCharacterStatModified(result.defender, "ac")} ac${
        result.outcome === "hit" ? ` for ${result.damage} damage` : ""
      }.`
    : "No result";
