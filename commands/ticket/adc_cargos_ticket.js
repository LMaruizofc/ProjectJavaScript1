const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const { adccargosTicket } = require("../../db/moderation");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("adc_cargos_ticket")
    .setDescription("Adiciona um cargo aos overwrites do ticket")
    .addRoleOption((option) => 
        option
            .setName("cargo")
            .setDescription("Mencione o cargo")
            .setRequired(true)
    )
    .addRoleOption((option) => 
        option
            .setName("mention_cargo")
            .setDescription("Cargo para mencionar no ticket")
    ),
    permission: PermissionFlagsBits.ManageGuild,
    name: "adc_cargos_ticket",
    description: "Adiciona um cargo aos overwrites do ticket",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction){

        const cargo = interaction.options.getRole("cargo")
        const mention_cargo = interaction.options.getRole("mention_cargo")

        await interaction.deferReply()
        await interaction.followUp({content: `${cargo.name} adicionado aos ticket`})
        await adccargosTicket(interaction.guild, cargo)

        if (mention_cargo != null){
            await interaction.followUp({content:`${mention_cargo.name} Adicionado as menções`})
            await adccargosTicket(interaction.guild, mention_cargo)
            await adccargosTicket(interaction.guild, mention_cargo, "mentionable")
        }
            
    }
}