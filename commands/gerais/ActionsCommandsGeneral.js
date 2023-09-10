const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");
const { loadCommandsPrefix } = require("../../utils/loaders");
const logger = require("../../logger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("utilitarios")
        .setDescription("Comandos gerais")
        .addSubcommand((SubCommand) =>
            SubCommand
                .setName("avatar")
                .setDescription("Envia o avatar de um membro")
                .addUserOption((option) =>
                    option
                        .setName("membro")
                        .setDescription("Membro para ver o avatar")
                )
        )
        .addSubcommand((SubCommand) =>
            SubCommand
                .setName("convidar")
                .setDescription("Envia o link para me convidar")
        )
        .addSubcommand((SubCommand) =>
            SubCommand
                .setName("ajuda")
                .setDescription("Envia meus comandos")
        )
        .addSubcommand((SubCommand) =>
            SubCommand
                .setName("tabuada")
                .setDescription("Envia a tabuada de um numero até 10")
                .addIntegerOption((option) =>
                    option
                        .setName("numero")
                        .setDescription("Teste")
                        .setRequired(true)
                )
        )
        .addSubcommand((SubCommand) =>
            SubCommand
                .setName("teste")
                .setDescription("teste")
        )
        .setDMPermission(false),
    /**
     * @param { ChatInputCommandInteraction } interaction
     */
    async execute(interaction, autoComplete = false) {
        try {
            loadCommandsPrefix("./commands", interaction.options.getSubcommand(), interaction, autoComplete)
        } catch (e) {
            logger.error(e)
        }

    }
}