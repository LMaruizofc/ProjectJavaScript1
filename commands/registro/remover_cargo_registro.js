const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("remover_cargo_registro")
    .setDescription("Remove um cargo de uma categoria do registro"),
}