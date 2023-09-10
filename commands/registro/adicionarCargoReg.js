const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("adicionar_cargo_registro")
    .setDescription("Adiciona ou edita um cargo ao registro"),
}