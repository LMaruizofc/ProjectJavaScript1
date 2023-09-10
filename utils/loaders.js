const { Collection, REST, Routes } = require("discord.js")
const logger = require("../logger")
const fs = require("fs");
const { configData } = require("..");

let commands = [];
const commandSlash = new Collection();
const rest = new REST().setToken(process.env.TOKEN)

async function loadCommandsPrefix(path, command = "none", msg = null, autoComplete = false) {
    if (command == "none") return
    try {
        let subFolderPath = fs.readdirSync(path)
        for (const name of subFolderPath) {
            if (fs.readdirSync(`${path}/${name}`).length >= 1) {
                let subFolderPath = fs.readdirSync(`${path}/${name}`).filter(file => file.endsWith(".ts") || file.endsWith(".js"))
                subFolderPath.forEach(async (commandName) => {
                    let cmd = require(`.${path}/${name}/${commandName}`)
                    if (cmd && cmd.name == `${command}` || cmd.aliases && cmd.aliases.includes(command)) {
                        try {
                            if (autoComplete) {
                                await cmd.autoComplete(msg)
                            } else {
                                if (cmd.permission && !msg.member.permissions.has(cmd.permission))
                                    return await msg.reply(
                                        {
                                            content: `Você Precisa da permissão de ${configData.permissions[cmd.permission]} para isso`,
                                            ephemeral: true
                                        }
                                    )
                                await cmd.execute(msg)
                                logger.usage(msg.member?.user.displayName, command)
                            }
                        } catch (err) {
                            logger.error(err)
                        };
                    };
                });
            };
        };
    } catch (err) {
        logger.error(err)
    };
};
function loadCommandsSlash(path) {
    commands = []
    commandSlash.clear()
    try {
        let subFolderPath = fs.readdirSync(path)
        for (const name of subFolderPath) {
            if (fs.readdirSync(`${path}/${name}`).length >= 1) {
                let subFolderPath = fs.readdirSync(`${path}/${name}`).filter(file => file.endsWith(".ts") || file.endsWith(".js"))
                subFolderPath.forEach((commandName) => {
                    let command = require(`.${path}/${name}/${commandName}`)
                    if (command.data) {
                        commands.push(command.data.toJSON())
                        commandSlash.set(command.data.name, command)
                    };
                })
            }
        }
    } catch (err) {
        logger.error(err)
    };
};
function loadEvents(path) {

    let events = fs.readdirSync(path)
    for (const name of events) {
        if (name.endsWith(".ts") || name.endsWith(".js")) {
            require(`.${path}/${name}`)
        } else {
            loadEvents(`./${path}/${name}`)
        };
    };
};
async function loadSlash(CLIENT_ID) {
    try {
        const data = await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log(`Registrei ${data.length} Slash Commands.`);
    } catch (error) {
        logger.error(error)
    };
};

module.exports = {
    loadSlash,
    loadEvents,
    loadCommandsPrefix,
    commandSlash
}

loadCommandsSlash("./commands")
