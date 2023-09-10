const { ButtonInteraction, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");
const { regCargo } = require("../../db/registro");

module.exports = {
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {

        const e = new EmbedBuilder()
            .setTitle("Registro")
            .setFooter({text: interaction.message.embeds[0].footer.text})

        if (interaction.message.embeds[0].footer.text.split("\n")[1].split(" ")[1] != interaction.user.id)
            return interaction.reply({ content: "Sem permissão", ephemeral: true })

        const actionRow = new ActionRowBuilder()
        const SelectMenus = new StringSelectMenuBuilder()
            .setPlaceholder("Escolha os cargos")
            .setCustomId("SelectRegistro")
            .setMinValues(1)

        const rdb = await regCargo.findOne({ _id: interaction.guild.id })
        const catego = rdb[interaction.customId.split("-")[1]]

        for (const i in catego) {
            e.addFields({ name: `${catego[i]["name"]}`, value: `<@&${catego[i]["cargoid"]}>` })
            SelectMenus
                .addOptions({ "label": `${catego[i]["name"]}`, "value": `${catego[i]["cargoid"]}` })
        }

        SelectMenus
            .setMaxValues(SelectMenus.options.length + 1)
            .addOptions(
                [
                    { label: "Voltar", value: "MenuReg" },
                    { label: "Finalizar", value: "finalReg" }
                ]
            )

        actionRow
            .addComponents(SelectMenus)

        await interaction.reply({content: "Categoria selecionada", ephemeral: true})

        await interaction.message.edit(
            {
                embeds: [e],
                components: [actionRow]
            }
        )
    }
}