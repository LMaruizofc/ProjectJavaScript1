const { ChatInputCommandInteraction, Message } = require("discord.js");
const { getAllCommands } = require("../../funcsSuporte/help");

module.exports = {
    name: "ajuda",
    description: "Envia minha lista de comandos",
    /**
     * @param {ChatInputCommandInteraction | Message} msg 
     */
    async execute(msg) {
        msg.reply({ embeds: [getAllCommands()], ephemeral: true })
    }
}