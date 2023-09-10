const { ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const { adcLog } = require("../../db/moderation");

module.exports = {
    name: "set_logs",
    description: "Define as logs do bot",
    permission: PermissionFlagsBits.ManageChannels,
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction){
        await adcLog(interaction.guild, interaction.options.getString("log"),interaction.options.getChannel("canal"))
        await interaction.reply({content: "Log definida", ephemeral: true})
    }
}