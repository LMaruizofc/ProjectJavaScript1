const { ChatInputCommandInteraction, Message, InteractionType, PermissionFlagsBits, PermissionsBitField } = require("discord.js")
const { default: axios } = require("axios");
const logger = require("../../logger");

module.exports = {
    name: "clear",
    description: "Limpa as mensagens de um chat",
    permission: PermissionFlagsBits.ManageMessages,
    /**
     * @param {ChatInputCommandInteraction | Message} msg
     */
    async execute(msg) {

        let channel = msg.guild?.channels.cache.get(msg.channel?.id);

        let qnt = 0;

        if (msg.type != InteractionType.ApplicationCommand) {

            if (!msg.content.split(" ")[1]?.match(/[0-9]/)) return await msg.reply({ content: "Argumento quantidade necessario" });

            if (msg.content.split(" ")[2]) channel = msg.guild?.channels.cache.get(msg.content.split(" ")[2].replace(/[<#>]/g, ""));

            qnt = parseInt(msg.content.split(" ")[1]);

            await msg.delete();

        } else {

            qnt = msg.options.getInteger("quantidade");

            if (msg.options.getChannel("canal")) channel = msg.options.getChannel("canal");

            await msg.reply({ content: "Começando", ephemeral: true });

        };

        if (qnt > 100) {
            qnt = 100
        }

        for (var i of await channel.messages.fetch({ limit: qnt })) {
            const date1 = new Date(msg.createdTimestamp)
            const date2 = new Date(i[1].createdTimestamp)
            const diffTime = Math.abs(date1 - date2);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 14) {
                deleteM(channel, i)
                await new Promise(x => setTimeout(x, 5000))
            } else {
                await channel.bulkDelete(qnt, true)
            }

        }

    }
}

async function deleteM(channel, i) {
    axios({
        url: `https://discord.com/api/v10/channels/${channel.id}/messages/${i[1].id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bot ${process.env.TOKEN}`
        }
    }).catch(e => logger.error(e))
}