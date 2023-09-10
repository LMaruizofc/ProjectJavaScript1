const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ver_pontos_evento")
    .setDescription("Mostra os pontos de evento de um membro"),
}