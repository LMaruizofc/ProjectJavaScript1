const { ChatInputCommandInteraction, Message, PermissionFlagsBits } = require("discord.js");
const logger = require("../../logger");

module.exports = {
    name: "kick",
    description: "Expulsa um membro do servidor",
    permission: PermissionFlagsBits.KickMembers,
    /**
     * @param {ChatInputCommandInteraction | Message} msg
     */
    async execute(msg) {

        const fs = await msg.reply({ content: "Envie os ids dos membros um embaixo do outro" })

        const collectorfilter = (m) => m.author?.id === msg.member?.user?.id | !msg.member?.user?.bot
        const collector = msg.channel?.createMessageCollector({ filter: collectorfilter, max: 1, time: 60000 })

        const embed = new EmbedBuilder()
            .setTitle("Expulsar")
            .setFooter({ text: msg.member?.user?.id })
        let desc = ""

        collector.on("collect", async (message) => {

            message.delete()

            const client = await msg.guild?.members.fetch(msg.client.user.id)

            for (const i of message.content.split("\n")) {

                try {

                    let member = await msg.guild?.members.fetch(i.replace(/[<@>]/g, ""))

                    if (member?.roles?.highest.position >= client.roles?.highest.position) {
                        let msgM = await msg.channel?.send({ content: `Não consigo expulsar o membro ${member}` });
                        msgDelete(msgM, 3000)
                    } else {
                        desc += `${member}\n`
                    }

                } catch {

                    try {
                        let user = await msg.client.users.fetch(i.replace(/[<@>]/g, ""))
                        desc += `${user.displayName} ${user.id}\n`
                    } catch {
                        let msgM = await msg.channel?.send({ content: `${i} não é um usuario` })
                        msgDelete(msgM, 3000)
                    }

                }
            }

            if (desc.length == 0) {
                await fs.edit({ content: "Não consegui expulsar ninguem" });
                msgDelete(fs, 0)
                return
            }

            embed.setDescription(desc)

            await fs.edit({ content: "Qual motivo?" })

            msg.channel?.awaitMessages({ filter: collectorfilter, max: 1, time: 60000})
                .then(async (message) => {
                    message.delete()
                    embed.addFields([{ name: "Motivo", value: `${message.first()?.content}` }])
                    const button = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel("✔")
                                .setCustomId("confirm")
                                .setStyle(ButtonStyle.Danger),
                            new ButtonBuilder()
                                .setLabel("X")
                                .setCustomId("deny")
                                .setStyle(ButtonStyle.Danger)
                        )
                    await fs.edit({
                        content: "",
                        embeds: [embed],
                        components: [button]
                    })
                })
                .catch(async (e) => {
                    logger.error(e)
                    const button = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel("X")
                                .setCustomId("x")
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true)
                        )

                    await fs.edit({ content: "Tempo esgotado", components: [button] })
                })
        })

        collector.on("end", async (e) => {
            if (collector.endReason == "time") {
                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("X")
                            .setCustomId("x")
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true)
                    )

                await fs.edit({ content: "Tempo esgotado", components: [button] })
            }
        })

    }
}