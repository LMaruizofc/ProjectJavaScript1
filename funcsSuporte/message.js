const { Message } = require("discord.js");
const logger = require("../logger");

module.exports = {
    /**
     * @param {Message} message 
     * @param {Number} time 
     */
    async msgDelete(message, time) {
        setTimeout(async () => {
            message.delete()
                .catch(async (err) => {
                    logger.error(err)
                    let ms = message.channel.send({ content: "Por favor não apague as mensagens que eu mando aqui, que eu mesmo apago" });
                    await msgDelete(ms, 3000);
                });
        }, time);
    },
    /**
     * @param {Message} message 
     * @param {Array<string>} reaction 
     */
    async addReaction(message, reaction) {

        try {
            for (const i of reaction) {
                if (i != "")
                    message.react(i)
            }
        } catch (err) {
            logger.error(err)
        }
    },
}