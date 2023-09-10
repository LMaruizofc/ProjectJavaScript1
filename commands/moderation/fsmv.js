const { ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "force_move",
    description: "Move um membro de uma call para outra",
    permission: PermissionFlagsBits.MoveMembers,
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction){
        const member = await interaction.guild.members.fetch(interaction.options.getUser("membro").id)
        const channel = interaction.options.getChannel("call")

        if (member.voice?.channel){
            if (!channel.isVoiceBased()) return await interaction.reply({content: `${channel} não é um canal de voz`, ephemeral: true})
            await member.voice.setChannel(channel, `Movido por: ${interaction.user.displayName}`)
            await interaction.reply({content: "Membro movido com sucesso"})
        } else {
            await interaction.reply({content: `O membro ${member} não está em uma call`, ephemeral: true})
        }
    }
}