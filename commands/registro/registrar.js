const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const { regCargo } = require("../../db/registro");
const { creatorButtons } = require("../../funcsSuporte/components");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("registrar")
        .setDescription("Registra um membro")
        .addUserOption((option) =>
            option
                .setName("membro")
                .setDescription("Membro a registrar")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("modo")
                .setDescription("Modo de registro")
                .addChoices(
                    { name: "Adicionar", value: "143" },
                    { name: "Remover", value: "181322" }
                )
                .setRequired(true)
        )
        .setDMPermission(false),
    name: "registrar",
    description: "Registra um membro",
    permission: PermissionFlagsBits.ManageRoles,
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const membro = await interaction.guild.members.fetch(interaction.options.getUser("membro"))
        const e = new EmbedBuilder()
            .setTitle("Registro")
            .setDescription("Escolha a categoria que deseja")
            .setFooter({ text: `Registrado ${membro.id}\nRegistrador ${interaction.user.id}\n${interaction.options.getString("modo")}` })
        const buttons = []
        for (const i in await regCargo.findOne({ _id: interaction.guild.id })) {
            if (i != "_id") {
                if (i != "defaults") {
                    buttons.push({ label: i, customId: `categos-${i}`, style: 1 })
                }
            }

        }
        await interaction.reply({ embeds: [e], components: creatorButtons(buttons) })
    }
}