const { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType } = require("discord.js");
const { loadCommandsPrefix } = require("../../utils/loaders");
const logger = require("../../logger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("moderação")
        .setDescription("Comandos de moderation")
        .addSubcommand((SubCommand) =>
            SubCommand
                .setName("clear")
                .setDescription("Limpa as mensagens de um chat")
                .addIntegerOption((option) =>
                    option
                        .setName("quantidade")
                        .setDescription("Quantidade de mensagens a limpar")
                        .setRequired(true)
                )
                .addChannelOption((option) =>
                    option
                        .setName("canal")
                        .setDescription("Canal que deseja limpar")
                        .addChannelTypes(ChannelType.GuildText)
                )
        )
        .addSubcommand((SubCommand) =>
            SubCommand
                .setName("kick")
                .setDescription("Expulsa um membro do servidor")
        )
        .addSubcommand((SubCommand) =>
            SubCommand
                .setName("ban")
                .setDescription("Bane um membro do servidor")
        )
        .addSubcommand((SubCommand) =>
            SubCommand
                .setName("force_disconect")
                .setDescription("Disconecta um membro da call que estiver")
                .addUserOption((option) =>
                    option
                        .setName("membro")
                        .setDescription("Membro a disconectar")
                        .setRequired(true)
                )
        )
        .addSubcommand((SubCommand) =>
            SubCommand
                .setName("set_logs")
                .setDescription("Define as logs do bot")
                .addStringOption((option) =>
                    option
                        .setName("log")
                        .setDescription("Log para definit")
                        .setRequired(true)
                        .addChoices(
                            { name: "Log de Registro", value: "regLog" },
                            { name: "Log De Ticket", value: "tckLog" }
                        )
                )
                .addChannelOption((option) =>
                    option
                        .setName("canal")
                        .setDescription("Canal para definir as logs")
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
        )
        .addSubcommand((SubCommand) =>
            SubCommand
                .setName("force_move")
                .setDescription("Move um membro de uma call para outra")
                .addUserOption((option) =>
                    option
                        .setName("membro")
                        .setDescription("Membro a mover para outra call")
                        .setRequired(true)
                )
                .addChannelOption((option) =>
                    option
                        .setName("call")
                        .setDescription("Call para mover o membro")
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildVoice)

                )
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