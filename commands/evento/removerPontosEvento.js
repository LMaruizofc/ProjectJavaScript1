const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("remover_pontos_evento")
    .setDescription("Remove um ponto de evento a um membro"),
}