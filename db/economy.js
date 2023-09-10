const { GuildMember } = require("discord.js")
const { MongoClient } = require("mongodb")

const cluster = new MongoClient(process.env.MONGOKET)
const db = cluster.db("IVM")
const economy = db.collection("economy")
const mercado = db.collection("mercado")

module.exports = {
    /**
     * @param {GuildMember} membro 
     * @param {Number} REcoins 
     */
    async update_bank(membro, REcoins) {
        if (membro) {
            if (await economy.countDocuments({ "_id": membro.id }) == 0) {
                economy.insertOne({ _id: membro.id, Nome: membro.name })
            }
            economy.updateOne(
                { "_id": membro.id },
                {
                    "$inc": {
                        "REcoins": REcoins
                    }
                },
                { upsert: true }
            )
        }
    },
    /**
     * @param {GuildMember} member 
     * @param {String} item 
     * @param {Number} qnt 
     */
    async update_inv(member, item, qnt) {
        if (member) {
            economy.updateOne(
                { _id: member.id },
                {
                    $inc: {
                        [`inventario.${item.toLowerCase()}`]: qnt
                    }
                },
                { upsert: true }
            )
        }
    },
    /**
     * @param {String} catego
     * @param {String} item 
     * @param {String} qual 
     * @param {Number} valor 
     */
    async market_update(catego, item, qual, valor) {
        if (catego) {
            mercado.updateOne(
                { _id: "mercado" },
                {
                    $set: {
                        [`${catego.toLowerCase()}.${item.toLowerCase()}.${qual.toLowerCase()}`]: valor
                    }
                },
                { upsert: true }
            )
        }
    }
}