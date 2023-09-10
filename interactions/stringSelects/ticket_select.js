const { AnySelectMenuInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const fs = require("fs")
const { mod } = require("../../db/moderation")

module.exports = {
    /**
     * @param {AnySelectMenuInteraction} interaction 
     */
    async execute(interaction) {
        await interaction.update({ fetchReply: false })
        await interaction.followUp({ content: "Criando ticket", ephemeral: true })

        if (!fs.existsSync("tickets")) {
            fs.mkdirSync("./tickets")
        }
        let ticket
        for (const i of interaction.message.toJSON()["components"][0]["components"][0]["options"]) {
            if (interaction.values[0] == i["value"]) {
                ticket = `${i["label"]}-${interaction.user.id}`
                break
            }
        }

        if ((await interaction.guild.channels.fetch()).filter((c) => c.type === 4 && c.id == interaction.values[0].split("-")[1]).size == 0) {
            return await interaction.followUp({ content: "Não encontrei a categoria para abrir o ticket", ephemeral: true })
        }

        for (const i of (await interaction.guild.channels.fetch()).filter((c) => c.type === 0 && c.parentId == interaction.values[0].split("-")[1])) {
            if (i[1].name == ticket) {
                return await interaction.followUp({ content: "Você já possue um ticket aberto nesta categoria", ephemeral: true })
            }
        }

        const rolesmention = [""]
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
        if (rtk && rtk["mentionable"]) {
            for (const i of rtk["mentionable"]) {
                rolesmention.push(`<@&${i}>`)
            }
        }

        const channel = await interaction.guild.channels.create(
            {
                name: `${ticket}`,
                parent: interaction.values[0].split("-")[1],
                permissionOverwrites: overwrites
            }
        )
        
        const message = {
            content: `${interaction.user} ${rolesmention.join("")}`,
            embeds: [{
                title: `Ticket de ${interaction.user.displayName}`,
                description: "Clique em 🔒 para fechar o ticket",
                footer: {
                    text: interaction.user.id
                }
            }],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("🔒 Fechar ticket")
                            .setCustomId("closeTicket")
                            .setStyle(ButtonStyle.Primary)
                    )
            ]
        }
        if (interaction.message.author.discriminator == "0000") {
            const webhook = await channel.createWebhook({
                name: interaction.message.author.displayName,
                avatar: interaction.message.author.displayAvatarURL()
                
            })
            await webhook.send(message)
        } else {
            await channel.send(message)
        }

        await interaction.followUp(
            {
                content: "Ticket criado com sucesso",
                ephemeral: true,
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel("Atalho para o Ticket")
                                .setURL(channel.url)
                                .setStyle(ButtonStyle.Link)
                        )
                ]
            }
        )
    }
}