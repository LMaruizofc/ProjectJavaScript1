const { ButtonInteraction, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { creatorButtons } = require("../../funcsSuporte/components");
const { mod } = require("../../db/moderation");

module.exports = {
    /**
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        const message = {
            embeds: [
                {
                    title: interaction.message.embeds[0].title,
                    description: `Ticket fechado por ${interaction.user}\nClique em 🔓 para abrir o reabrir ticker\nClique em 🚫 para deletar o ticket`,
                    footer: {
                        text: interaction.message.embeds[0].footer.text
                    }
                }
            ],
            avatarURL: interaction.message.author.avatarURL(),
            components: creatorButtons(
                    [
                        { label: "🔓 Abrir Ticket", customId: "openTicket", style: ButtonStyle.Primary },
                        { label: "🚫 Deletar Ticket", customId: "deleteTicket", style: ButtonStyle.Primary }
                    ]
                )

        }

        const overwrites = [
            {
                id: interaction.message.embeds[0].footer.text,
                deny: [
                    PermissionFlagsBits.ViewChannel
                ],
                type: 1
            },
            {
                id: interaction.guild.id,
                deny: [
                    PermissionFlagsBits.ViewChannel
                ],
            },
            {
                id: interaction.client.user.id,
                allow: [
                    PermissionFlagsBits.ViewChannel
                ],
                type: 1
            }
        ]

        const rtk = await mod.findOne({ _id: interaction.guild.id })
        if (rtk && rtk["rolesTicket"]) {
            for (const i of rtk["rolesTicket"]) {
                overwrites.push(
                    {
                        id: i,
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
        if (interaction.message.author.discriminator === "0000") {
            const webhook = await interaction.message.fetchWebhook()
            await interaction.message.delete()
            await webhook.send(message)
        } else {
            await interaction.message.delete()
            await interaction.channel.send(message)
        }
    }
}