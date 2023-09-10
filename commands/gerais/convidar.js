const { ChatInputCommandInteraction, Message } = require("discord.js");

module.exports = {
    name: "convidar",
    description: "Envia o link para me convidar para seu servidor",
    /**
     * @param {ChatInputCommandInteraction | Message} msg 
     */
    async execute(msg) {

        msg.reply(
            {
                content: `https://discord.com/api/oauth2/authorize?client_id=${msg.client.application.id}&permissions=8&scope=bot%20applications.commands`,
                ephemeral: true
            }
        )

    }
}