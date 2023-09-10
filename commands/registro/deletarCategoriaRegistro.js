const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("deletar_categoria_registro")
    .setDescription("Deleta uma categoria do registro"),
}