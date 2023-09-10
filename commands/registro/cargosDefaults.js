const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("cargos_defaults")
    .setDescription("Adiciona os cargos defaults do registro"),
}