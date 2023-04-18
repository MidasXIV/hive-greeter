type BotConfig = {
  prefix: string /** Prefix used for bot commands.    */;
  "bot-health-channel": string /** channel-id to post bot messages. */;
  "economic-events-api-endpoint": string;
};

const config: BotConfig = {
  prefix: "/",
  "bot-health-channel": "732716500263108622",
  "economic-events-api-endpoint":
    "https://www.anavrin.app/api/services/economic-events",
};

export default config;
