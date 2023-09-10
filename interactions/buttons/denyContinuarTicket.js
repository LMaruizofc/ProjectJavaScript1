const { ModalBuilder, TextInputBuilder, ActionRowBuilder, ButtonInteraction, TextInputStyle } = require("discord.js");
const { tempdbTicket } = require("../../db/ticket");

/**
 * @param {ButtonInteraction} interaction 
 */
exports.execute = async (interaction) => {

    await tempdbTicket.delete(interaction.guildId)

    const webhook = interaction.message.embeds[0].fields[0].value
    const imagewebhook = interaction.message.embeds[0].fields[1].value
    const channel = interaction.message.embeds[0].fields[2].value
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
        .setCustomId(`canal-${channel}`)
        .setLabel("url da imagem da embed da embed")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    const firstActionRow = new ActionRowBuilder().addComponents(titleEmbed);
    const secondActionRow = new ActionRowBuilder().addComponents(descriptionEmbed);
    const threActionRow = new ActionRowBuilder().addComponents(imageEmbed);

    modal.addComponents(firstActionRow, secondActionRow, threActionRow);

    await interaction.showModal(modal);
}