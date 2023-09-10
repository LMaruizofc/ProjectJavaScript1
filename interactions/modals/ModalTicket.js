const { ModalSubmitInteraction, range, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { tempdbTicket } = require("../../db/ticket");
const { mod } = require("../../db/moderation");

module.exports = {
    /**
     * @param {ModalSubmitInteraction} interaction 
     */
    async execute(interaction) {

        const webhookVName = interaction.fields.fields.filter(x => { if (x.customId.indexOf("webhook") >= 0) return x })
        const imageVUrl = interaction.fields.fields.filter(x => { if (x.customId.indexOf("image") >= 0) return x })
        const channelID = interaction.fields.fields.filter(x => { if (x.customId.indexOf("canal") >= 0) return x })
        
        await tempdbTicket.addinfo("setup", interaction.guildId, {
            webhook: {
                name: webhookVName.firstKey().split("-")[1],
                image: imageVUrl.firstKey().split("-")[1],
            },
            embed: {
                title: interaction.fields.fields.get(webhookVName.firstKey()).value,
                description: interaction.fields.fields.get(imageVUrl.firstKey()).value,
                image: {
                    url: interaction.fields.fields.get(channelID.firstKey()).value
                }
            },
            channelID: channelID.firstKey().split("-")[1]
        })

        const checkP = await mod.findOne({ "_id": interaction.guild.id })

        let lb
        const selectMenu = new StringSelectMenuBuilder()
            .setPlaceholder("Quantidade")
            .setCustomId("SelectQnt")
        for (const i of range(20)) {
            if (i > 3) {
                if (checkP && checkP.premium && checkP.premium.enable) {
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

        try {
            await interaction.update({
                content: "Serão quantos tickets?",
                embeds: [],
                components: [new ActionRowBuilder().addComponents(selectMenu)],
                ephemeral: true
            })
        } catch {
            await interaction.reply({
                content: "Serão quantos tickets?",
                embeds: [],
                components: [new ActionRowBuilder().addComponents(selectMenu)],
                ephemeral: true
            })
        }

    }

}
