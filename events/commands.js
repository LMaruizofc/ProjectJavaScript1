const configData = require('..');
const client = require("../utils/index");
const logger = require("../logger");
const { Message } = require('discord.js');

// Commands prefix Administrator
/**
 * @param {Message} msg 
 */
client.on("messageCreate", async (msg) => {

	if (!msg.content.startsWith(configData.prefix) || msg.author.bot || !msg.guild) return;
	const commandName = msg.content.toLowerCase().split(" ")[0].substring(configData.prefix.length);
	if (commandName.length == 0) return;

	try {
		//await loadCommandsPrefix("./commands", commandName, msg)
	} catch (err) {
		logger.error(err)
	};
});