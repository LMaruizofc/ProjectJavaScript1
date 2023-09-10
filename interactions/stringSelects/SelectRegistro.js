const { StringSelectMenuInteraction, EmbedBuilder } = require("discord.js")
const moment = require("moment-timezone")
const { regCargo, tempdbReg } = require("../../db/registro")
const { creatorButtons } = require("../../funcsSuporte/components")

module.exports = {
    /**
     * @param {StringSelectMenuInteraction} interaction
     */
    async execute(interaction) {

        if (interaction.message.embeds[0].footer.text.split("\n")[1].split(" ")[1] != interaction.user.id)
            return interaction.reply({ content: "Sem permissão", ephemeral: true })

        const registrado = await interaction.guild.members.fetch(interaction.message.embeds[0].footer.text.split("\n")[0].split(" ")[1])

        const roles = []
        let opt = "";
        const tempdb = new tempdbReg()
        for (const i of interaction.values) {
            if (i.match(/[0-9]/)) {
                roles.push(i)
            } else {
                opt = i
            }
        }

        if (opt === "MenuReg") {
            await tempdb.addRole(
                interaction.guild.id, 
                interaction.message.embeds[0].footer.text.split("\n")[0].split(" ")[1],
                roles,
            )
            await interaction.reply({content: "Voltando para o Menu de registro", ephemeral: true})
            const e = new EmbedBuilder()
                .setTitle("Registro")
                .setDescription("Escolha a categoria que deseja")
                .setFooter({ text: interaction.message.embeds[0].footer.text })
            const buttons = []
            for (const i in await regCargo.findOne({ _id: interaction.guild.id })) {
                if (i != "_id") {
                    if (i != "defaults") {
                        buttons.push({ label: i, customId: `categos-${i}`, style: 1 })
                    }
                }

            }
            await interaction.message.edit({ embeds: [e], components: creatorButtons(buttons) })
        } else if (opt === "finalReg") {
            await tempdb.addRole(
                interaction.guild.id, 
                interaction.message.embeds[0].footer.text.split("\n")[0].split(" ")[1],
                roles,
            )
            if (interaction.message.embeds[0].footer.text.split("\n")[2] == "143"){
                const rolesD = await regCargo.findOne({_id: interaction.guildId})
                const roles = await tempdb.getDatas(interaction.guildId,registrado.id)
                roles.push(rolesD.defaults.finalreg.cargoid)
                await registrado.roles.add(roles,"Registro")
                await registrado.roles.remove(rolesD.defaults.defaultreg.cargoid, "Registro")
            } else {
                await registrado.roles.remove(await tempdb.getDatas(interaction.guildId,registrado.id),"Registro")
            }
            const embed = new EmbedBuilder()
                .setTitle("Registro")
                .addFields(
                    [
                        { name: "Registrado", value: `${registrado.user.displayName}(${registrado.id})`, inline: false },
                        { name: "Registrador", value: `${interaction.user.displayName}(${interaction.user.id})`, inline: false },
                        { name: "Servidor", value: `${interaction.guild.name}`, inline: false },
                        { name: "Data", value: `${moment(interaction.createdTimestamp).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")}`, inline: false }
                    ]
                )
            await interaction.message.delete()
            await interaction.reply({content: "Membro registrado com sucesso", ephemeral: true})
            await registrado.send({ embeds: [embed] })
        } else {
            await interaction.message.edit()
            await interaction.reply({ content: "Favor, selecionar voltar ou finalizar para proceguir", ephemeral: true })
        }
    }
}