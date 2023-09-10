const { ActivityType, Client, GatewayIntentBits } = require("discord.js");
const { loadEvents, loadSlash } = require("./loaders");
const logger = require("../logger");

const client = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once("ready", async (self) => {
    self.user.setPresence({ status: "idle", activities: [{ type: ActivityType.Playing, name: "Em ReDesenvolvimento" }] })
    console.log("[BOT] Eu entrei com " + self.user.username)
    loadSlash(self.application.id)
    loadEvents("./events")
    logger.clear()
})

module.exports = client