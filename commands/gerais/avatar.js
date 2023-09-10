const { InteractionType, ChatInputCommandInteraction, Message } = require("discord.js");

module.exports = {
    name: "avatar",
    description: "Envia o avatar de um membro",
    /**
     * @param {ChatInputCommandInteraction | Message} msg 
     */
    async execute(msg) {

        let member;

        if (msg.type != InteractionType.ApplicationCommand) {
            if (!msg.content.split(" ")[1]) {
                member = msg.author;
            } else {
                member = await msg.client.users.fetch(msg.content.split(" ")[1].replace(/[<@>]/g, ""));
            };
        } else {
            if (msg.options.getUser("membro") != null) {
                member = msg.options.getUser("membro");
            } else {
                member = msg.user;
            };
        };

        await msg.reply(
            {
                embeds: [
                    {
                        title: `Avatar de ${member.username}`,
                        image: {
                            url: `${member.avatarURL({ dynamic: true, format: 'png', size: 2048 })}`
                        }
                    }
                ],
                ephemeral: true
            }
        );
    }
}