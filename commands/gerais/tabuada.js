const { EmbedBuilder, range, InteractionType, ChatInputCommandInteraction, Message } = require("discord.js");

module.exports = {
  name: "tabuada",
  description: "Envia a tabuada de um numero até 10",
  /**
   * @param {ChatInputCommandInteraction | Message} msg 
   */
  async execute(msg) {

    let valor = 0;
    if (msg.type != InteractionType.ApplicationCommand) {
      if (!msg.content.split(" ")[1]?.match(/[0-9]/)) return await msg.reply({ content: "argumento valor necessario" })
      valor = parseInt(msg.content.split(" ")[1])
    } else {
      valor = msg.options.getInteger("numero")
    }

    if (valor <= 0) { return msg.reply({ content: "O numero precisa ser maior que 0", ephemeral: true }) }

    const e = new EmbedBuilder()

    let x = 0

    for (const i of range({ start: valor, end: valor * 11, step: valor })) {
      x++
      e.addFields({ name: `${valor} x ${x}`, value: `${i}` })
    }

    msg.reply({ embeds: [e], ephemeral: true })

  },
};