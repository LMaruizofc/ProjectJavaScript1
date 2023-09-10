const { ButtonInteraction } = require("discord.js");
const discordTranscripts = require('discord-html-transcripts');
const fs = require("fs");

module.exports = {
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {

        const channel = interaction.channel;

        const attachment = await discordTranscripts.createTranscript(
            channel,
            {
                poweredBy: false,
                returnType: "string"
            })

        if (!fs.existsSync(`./tickets/${interaction.guild.id}`)){
            fs.mkdirSync(`./tickets/${interaction.guild.id}`)
        }
        fs.writeFile(
            `./tickets/${interaction.guild.id}/${channel.name.split("-")[0]}_${interaction.message.embeds[0].footer.text}.html`,
            attachment,
            (e) => {}
        )

        await interaction.channel.delete()

    }
}