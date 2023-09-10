const { SlashCommandBuilder, AutocompleteInteraction, ChatInputCommandInteraction } = require("discord.js");
const fs = require("fs")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("enviar_ticket")
        .setDescription("Envia o arquivo de um ticket de um membro")
        .addUserOption((option) =>
            option
                .setName("membro")
                .setDescription("Membro para escolher o arquivo")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("ticket")
                .setDescription("Escolha o ticket")
                .setRequired(true)
                .setAutocomplete(true)
        ),
    name: "enviar_ticket",
    description: "Envia o arquivo de um ticket de um membro",
    /**
     * @param {AutocompleteInteraction} interaction 
     */
    async autoComplete(interaction) {

        const focusedValue = interaction.options.getFocused();
        const user = interaction.options.get("membro")
        const choices = [];
        if (fs.existsSync(`./tickets/${interaction.guildId}`)) {
            for (const i of fs.readdirSync(`./tickets/${interaction.guildId}`)) {
                if (i.endsWith(".html") && i.indexOf(user.value) >= 0) {
                    choices.push(i)
                }
            }
        }
        if (choices.length == 0) {
            choices.push("Não encontrei tickets do membro de id " + user.value)
        }
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {

        if (interaction.options.get("ticket").value.endsWith(".html")) {
            await interaction.reply({
                content: `ticket de <@${interaction.options.get("membro").value}>`,
                files: [`./tickets/${interaction.guildId}/${interaction.options.get("ticket").value}`],
                ephemeral: true
            })
        } else {
            await interaction.reply({
                content: "Não encontrei nenhum ticket",
                ephemeral: true
            })
        }
    }
}