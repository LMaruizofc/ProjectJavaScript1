const { ButtonInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
    /**
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        if (interaction.user.id === interaction.message?.embeds[0]?.footer?.text || interaction.memberPermissions.has(PermissionFlagsBits.Administrator)){
            await interaction.message.delete()
        } else {
            await interaction.reply({content: "Sem permissão", ephemeral: true})
        }
    }
}