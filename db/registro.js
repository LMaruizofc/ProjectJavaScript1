const { Guild, Role } = require("discord.js")
const { MongoClient } = require("mongodb")
const { JsonDB, Config } = require("node-json-db")

const cluster = new MongoClient(process.env.MONGOKET)
const db = cluster.db("IVM")
const regCargo = db.collection("configReg")

class tempdbReg {

    constructor(){
        this.regdbtemp = new JsonDB(new Config("./db/dbtempreg",true,false));
        this.regdbtemp.load()
    }

    async addRole(guildId, userId, rolesId){

        let roles;
        if(await this.regdbtemp.exists(`./${guildId}/${userId}/roles`)){
            roles = await this.regdbtemp.getData(`./${guildId}/${userId}/roles`)
        } else {
            return await this.regdbtemp.push(`./${guildId}/${userId}/roles`,rolesId)
        }
        for (const i of rolesId){
            if (roles.indexOf(i) == -1 ){
                roles.push(i)
            }
        }
        await this.regdbtemp.push(`./${guildId}/${userId}/roles`,roles)
    }

    async getDatas(guildId,userId){
        const data = await this.regdbtemp.getData(`./${guildId}/${userId}/roles`)
        await this.regdbtemp.delete(`./${guildId}/${userId}/roles`)
        return data
    }
}

module.exports = {
    tempdbReg,
    regCargo,
    /**
     * @param {Guild} guild 
     * @param {Role} cargo 
     * @param {string} categoria 
     * @param {string} name 
     */
    async addCargoReg(guild, cargo, categoria, name) {
        await regCargo.updateOne(
            { _id: guild.id },
            {
                $set: {
                    [`${categoria}.${name}`]: {
                        "name": name,
                        "cargoid": cargo.id
                    }
                }
            },
            { upsert: true }
        )
    },

    /**
     * @param {Guild} guild 
     * @param {string} categoria 
     * @param {string} name 
     */
    async rmvCargoReg(guild, categoria, name) {
        await regCargo.updateOne(
            { _id: guild.id },
            {
                $unset: {
                    [`${categoria}.${name}`]: ["name", "cargoid"]
                }
            },
            { upsert: True }
        )
    },
}
