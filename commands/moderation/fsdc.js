const { ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "force_disconect",
    description: "Desconecta um membro da call que estiver",
    permission: PermissionFlagsBits.MoveMembers,
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction){
        const member = await interaction.guild.members.fetch(interaction.options.getUser("membro").id)
        if (member.voice?.channel){
            await member.voice.setChannel(null,`Disconectado por: ${interaction.user.displayName}`)
            await interaction.reply({content: "Membro desconectado com sucesso"})
        } else {
            await interaction.reply({content: `O membro ${member} não está em uma call`, ephemeral: true})
        }
    }
}