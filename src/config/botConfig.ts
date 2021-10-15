type BotConfig = {
  prefix: string                /** Prefix used for bot commands.    */
  "bot-health-channel": string  /** channel-id to post bot messages. */
};

const config: BotConfig = {
  prefix: ">",
  "bot-health-channel": "732716500263108622"
};

export default config;
