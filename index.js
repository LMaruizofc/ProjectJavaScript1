require("dotenv").config()
exports.configData = require(`./utils/config${process.env.BOT}`)
const client = require("./utils/index")
client.login(process.env.TOKEN)