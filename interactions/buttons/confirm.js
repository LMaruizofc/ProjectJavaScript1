const { ButtonInteraction } = require("discord.js");

module.exports = {
    /**
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {

        if (interaction.user.id === interaction.message?.embeds[0]?.footer?.text || interaction.memberPermissions.has(PermissionFlagsBits.Administrator)){
            switch (interaction.message?.embeds[0]?.title) {

                case "Banimento":
                    interaction.message.delete()
                    for (const i of interaction.message?.embeds[0]?.description?.split("\n")){
                        await interaction.guild?.bans.create(
                            i.split(" ")[i.split(" ").length-1].replace(/[<@>]/g, ""),
                            {
                                reason: `Banido por: ${interaction.user.displayName}\nMotivo: ${interaction.message?.embeds[0]?.fields[0]?.value}`
                            }
                        )
                    }
    
                    await interaction.channel.send({ content:`${interaction.user}\nMembros banidos com sucesso` })
                    break
                case "Expulsar":
                    interaction.message.delete()
                    for (const i of interaction.message?.embeds[0]?.description?.split("\n")){
                        await (await interaction.guild?.members.fetch(i)).kick(
                            `Expulso por: ${interaction.user.displayName}\nMotivo: ${interaction.message?.embeds[0]?.fields[0]?.value}`
                        )
                    }
    
                    await interaction.channel.send({ content:`${interaction.user}\nMembros expulsos com sucesso` })
                    break
            }
        } else {
            await interaction.reply({content: "Sem permissão", ephemeral: true})
        }
    }
}