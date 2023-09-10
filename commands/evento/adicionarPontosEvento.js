const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("adicionar_ponto_evento")
    .setDescription("Adiciona um ponto de evento a um membro"),
}