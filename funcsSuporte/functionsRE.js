const { ChatInputCommandInteraction, range, TextChannel, StringSelectMenuBuilder, ActionRowBuilder, Webhook } = require("discord.js");
const { tempdbTicket } = require("../db/ticket");

/**
 * @param {ChatInputCommandInteraction} interaction 
 */
exports.categosTicket = async (interaction) => {

    const data = await tempdbTicket.getinfos(interaction.guildId)
    await interaction.update({ content: "foi", components: [] })
    const filter = (m) => m.author.id === interaction.member.user.id

    for (const i of range(data.qntCategos)) {

        const m = await interaction.channel.send({
            content: `${i + 1}° Envie o nome do selectmenu e o id da categoria a abrir o ticket um embaixo do outro`,
        })

        const mcontent = await interaction.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ["time"] })

        await tempdbTicket.addinfo("categorias", interaction.guildId, {
            name: mcontent.first().content.split("\n")[0],
            value: mcontent.first().content.split("\n")[1]
        })

        await mcontent.first().delete()
        await m.delete()

    }

    await this.runTicket(interaction)

}

/**
 * @param {ChatInputCommandInteraction} interaction 
 */
exports.runTicket = async (interaction) => {

    const data = await tempdbTicket.getinfos(interaction.guildId)

    const selectmenus = new StringSelectMenuBuilder()
        .setCustomId("ticket_select")
        .setPlaceholder("Selcione a categoria do ticket");

    let v = 0;

    for (const i of data.categos) {
        selectmenus
            .addOptions(
                { label: i["name"], value: `c${v}-${i["value"]}` }
            );
        v++
    };

    const component = new ActionRowBuilder()
        .addComponents(selectmenus)

    const channel = await interaction.guild.channels.fetch(data.setup?.channelID)

    if (data.setup?.webhook?.name != "null") {
        const webhook = await channel.createWebhook({ name: data.setup?.webhook?.name, reason: "Ticket" })
        let img = ""
        if (data.setup?.webhook?.image != "null") {
            img = data.setup?.webhook?.image
        }
        await webhook.send({ embeds: [data.setup?.embed], components: [component], avatarURL: img })
    } else {
        await channel.send({ embeds: [data.setup?.embed], components: [component] })
    }

    await tempdbTicket.delete(interaction.guildId)

    await interaction.reply({ content: `Foi`, ephemeral: true })
}