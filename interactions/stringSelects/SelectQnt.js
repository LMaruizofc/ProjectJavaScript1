const { StringSelectMenuInteraction } = require("discord.js");
const { tempdbTicket } = require("../../db/ticket");
const { categosTicket } = require("../../funcsSuporte/functionsRE");

module.exports = {
    /**
     * @param {StringSelectMenuInteraction} interaction 
     */
    async execute(interaction) {

        if (interaction.values[0].indexOf("Premium") >= 0) {
            return interaction.reply({ content: "Você precisa ser um doador premium para isto", ephemeral: true })
        } else {
            await tempdbTicket.addinfo("categoriasQnt", interaction.guildId, parseInt(interaction.values[0]))
            await categosTicket(interaction)
        }
    }
}