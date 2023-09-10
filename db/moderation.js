const { Guild, TextChannel, Role } = require("discord.js")
const { MongoClient } = require("mongodb")

const cluster = new MongoClient(process.env.MONGOKET)
const db = cluster.db("IVM")
const adv = db.collection("adv")
const mod = db.collection("mod")

module.exports = {
    mod,
    adv,
    /**
     * @param {Guild} guild 
     * @param {String} name 
     * @param {TextChannel} canal 
     */
    async adcLog(guild, name, canal) {
        if (await mod.countDocuments({ _id: guild.id }) == 0) {
            await mod.updateOne(
                { _id: guild.id },
                { $set: { name: guild.name } },
                { upsert: true }
            )
        }

        await mod.updateOne(
            { _id: guild.id },
            { $set: { [`logs.${name}`]: [canal.id] } },
            { upsert: true }
        )
    },
    /**
     * @param {Guild} guild 
     * @param {String} name 
     * @param {Role} cargo 
     */
    async adccargosTicket(guild, cargo, name = null) {
        if (await mod.countDocuments({ _id: guild.id }) == 0) {
            await mod.updateOne(
                { _id: guild.id },
                { $set: { name: guild.name } },
                { upsert: true }
            )
        }

        await mod.updateOne(
            { _id: guild.id },
            { $addToSet: { "rolesTicket": cargo.id } },
            { upsert: true }
        )

        if (name != null){
            await mod.updateOne(
                { _id: guild.id },
                { $addToSet: { [`${name}`]: cargo.id } },
                { upsert: true }
            )
        }
    }
}