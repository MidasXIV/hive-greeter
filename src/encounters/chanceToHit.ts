// given a bonus to your roll, what are the chances of rolling above a target?
export const chanceToHit = ({
  bonus,
  dc,
}: {
  bonus: number;
  dc: number;
}): number => (21 - dc - bonus) / 20; // https://rpg.stackexchange.com/a/70349
