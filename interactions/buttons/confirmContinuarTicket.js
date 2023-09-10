const { StringSelectMenuBuilder, ActionRowBuilder, ButtonInteraction, range } = require("discord.js")
const { tempdbTicket } = require("../../db/ticket")
const { categosTicket, runTicket } = require("../../funcsSuporte/functionsRE")
const { mod } = require("../../db/moderation")

/**
 * 
 * @param {ButtonInteraction} interaction 
 */
exports.execute = async (interaction) => {

    const m = await interaction.update({content: "Continuando",embeds: [],components: [], ephemeral: true})

    const data = await tempdbTicket.getinfos(interaction.guilId)

    if (!data.qntCategos) {

        const checkP = await mod.findOne({ "_id": interaction.guild.id })

        let lb
        const selectMenu = new StringSelectMenuBuilder()
            .setPlaceholder("Quantidade")
            .setCustomId("SelectQnt")
        for (const i of range(20)) {
            if (i > 3) {
                if (checkP.premium?.enable) {
                    lb = `${i + 1}`
                } else {
                    lb = `${i + 1} ⭐Premium`
                }
                selectMenu
                    .addOptions(
                        { label: lb, value: `${lb}` }
                    )
            }
            else {
                selectMenu
                    .addOptions(
                        { label: `${i + 1}`, value: `${i + 1}` }
                    )
            }

        }

        await interaction.deferUpdate({
            content: "Serão quantos tickets?",
            components: [new ActionRowBuilder().addComponents(selectMenu)]
        })

    } else if (data.qntCategos != data.categos.length) {
        await categosTicket(interaction)
    } else if (data.qntCategos == data.categos.length){
        await runTicket(interaction)
    }
}