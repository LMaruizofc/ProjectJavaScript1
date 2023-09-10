const { ButtonInteraction, PermissionFlagsBits } = require("discord.js");
const { creatorButtons } = require("../../funcsSuporte/components");
const { mod } = require("../../db/moderation");

module.exports = {

    /**
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        const overwrites = [
            {
                id: interaction.guild.id,
                allow: [
                    PermissionFlagsBits.AttachFiles,
                    PermissionFlagsBits.SendMessages
                ],
                deny: [
                    PermissionFlagsBits.ViewChannel
                ],
                type: 0
            },
            {
                id: interaction.user.id,
                allow: [
                    PermissionFlagsBits.ViewChannel
                ],
                type: 1
            }
        ]

        const rtk = await mod.findOne({ _id: interaction.guild.id })["roleticket"]
        if (rtk) {
            for (const i of rtk) {
                const r = rtk[i]
                overwrites.push(
                    {
                        id: r[0],
                        allow: [
                            PermissionFlagsBits.ViewChannel
                        ],
                        type: 0
                    }
                )
            }
        }

        await interaction.channel.edit({
            permissionOverwrites: overwrites
        })
        const message = {
            avatarURL: interaction.message.author.displayAvatarURL(),
            embeds: [{
                title: `${interaction.message.embeds[0].title}`,
                description: `Ticket aberto por ${interaction.user}\nClique em 🔒 para fechar o ticket`,
                footer: {
                    text: interaction.message.embeds[0].footer.text
                }
            }],
            components: creatorButtons(
                    [
                        { label: "🔒 Fechar ticket", customId: "closeTicket", style: 1 }
                    ]
                )

        }
        if (interaction.message.author.discriminator == "0000") {
            const webhook = await interaction.message.fetchWebhook()
            await interaction.message.delete()
            await webhook.send(message)
        } else {
            await interaction.message.delete()
            await interaction.channel.send(message)
        }

    }
}