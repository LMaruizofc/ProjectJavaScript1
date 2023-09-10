const { SlashCommandBuilder, ChannelType, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ComponentType, PermissionFlagsBits } = require("discord.js");
const { tempdbTicket } = require("../../db/ticket");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup_ticket")
        .setDescription("Começa a configuração do ticket")
        .addStringOption((option) =>
            option
                .setName("name_webhook")
                .setDescription("Nome do webhook")
        )
        .addStringOption((option) =>
            option
                .setName("image_webhook")
                .setDescription("Link da imagem do webhook")
        )
        .addChannelOption((option) =>
            option
                .setName("canal")
                .setDescription("Canal para enviar a mensagem")
                .addChannelTypes(ChannelType.GuildText)
        ),
    name: "setup_ticket",
    description: "Começa a configuração do ticket",
    permission: PermissionFlagsBits.ManageGuild,
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {

        const data = await tempdbTicket.getinfos(interaction.guildId)

        const webhook = (interaction.options.getString("name_webhook")) ? interaction.options.getString("name_webhook") : "null"
        const imagewebhook = (interaction.options.getString("image_webhook")) ? interaction.options.getString("image_webhook") : "null"
        const channel = (interaction.options.getChannel("canal")) ? interaction.options.getChannel("canal") : interaction.channel

        const modal = new ModalBuilder()
            .setCustomId('ModalTicket')
            .setTitle('Iniciar Ticket');

        const titleEmbed = new TextInputBuilder()
            .setCustomId(`webhook-${webhook}`)
            .setLabel("Titulo da embed")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const descriptionEmbed = new TextInputBuilder()
            .setCustomId(`image-${imagewebhook}`)
            .setLabel("Descrição da embed")
            .setStyle(TextInputStyle.Paragraph);

        const imageEmbed = new TextInputBuilder()
            .setCustomId(`canal-${channel.id}`)
            .setLabel("url da imagem da embed da embed")
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const firstActionRow = new ActionRowBuilder().addComponents(titleEmbed);
        const secondActionRow = new ActionRowBuilder().addComponents(descriptionEmbed);
        const threActionRow = new ActionRowBuilder().addComponents(imageEmbed);

        modal.addComponents(firstActionRow, secondActionRow, threActionRow);

        if (data && !data.ended) {
            return await interaction.reply(
                {
                    content: `Ainda possue um setup de ticket em andamento, deseja continuar este ultimo?`,
                    ephemeral: true,
                    embeds: [
                        {
                            title: "infos adiconais",
                            fields: [
                                {name: "webhook", value: webhook},
                                {name: "imagewebhook", value: imagewebhook},
                                {name: "canal", value: channel.id}
                            ]
                        }
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("confirmContinuarTicket")
                                    .setLabel("✔")
                                    .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                    .setCustomId("denyContinuarTicket")
                                    .setLabel("X")
                                    .setStyle(ButtonStyle.Primary)
                            )
                    ]
                })
        }

        await interaction.showModal(modal);

    }
}