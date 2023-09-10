const client = require("../utils/index");
const logger = require("../logger");
const { commandSlash } = require("../utils/loaders");
const { ChatInputCommandInteraction } = require("discord.js");
const { configData } = require("..");

//Interactions administrator
/**
 * @param {ChatInputCommandInteraction} interaction 
 */
client.on("interactionCreate", async (interaction) => {

	if (interaction.isChatInputCommand()) {

		const command = commandSlash.get(interaction.commandName);

		if (!command) {
			return console.error(`No command matching ${interaction.commandName} was found.`);
		};

		if (!command.execute){
			return await interaction.reply({content: "Em redesenvolvimento", ephemeral: true})
		}

		try {
			if (command.permission && !interaction.member.permissions.has(command.permission))
				return await msg.reply(
					{
						content: `Você Precisa da permissão de ${configData.permissions[command.permission]} para isso`,
						ephemeral: true
					}
				)
			await command.execute(interaction)
		} catch (err) {
			if (interaction.replied || interaction.deferred) {
				logger.error(err)
			} else {
				logger.error(err)
			};
		};
	} else if (interaction.isButton()) {

		try {
			if (interaction.customId.indexOf("-") >= 0) {
				await require(`../interactions/buttons/${interaction.customId.split("-")[0]}`).execute(interaction)
			} else {
				await require(`../interactions/buttons/${interaction.customId}`).execute(interaction)
			}
		} catch (err) {
			logger.error(err)
		};

	} else if (interaction.isStringSelectMenu()) {

		try {
			await require(`../interactions/stringSelects/${interaction.customId}`).execute(interaction)
		} catch (err) {
			logger.error(err)
		};

	} else if (interaction.isAutocomplete()) {

		const command = commandSlash.get(interaction.commandName);

		if (!command) {
			return console.error(`No command matching ${interaction.commandName} was found.`);
		};

		try {
			if (command.autoComplete) {
				await command.autoComplete(interaction)
			} else {
				await command.execute(interaction, true)
			}
		} catch (err) {
			logger.error(err)

		};
	} else if (interaction.isModalSubmit()) {

		try {
			await require(`../interactions/modals/${interaction.customId}`).execute(interaction)
		} catch (err) {
			logger.error(err)
		};

	};
});