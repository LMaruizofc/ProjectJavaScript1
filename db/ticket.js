const { JsonDB, Config } = require("node-json-db");

class tempdbTicketClass{

    constructor() {
        this.ticketdbTemp = new JsonDB(new Config("./db/dbtempticket",true,true))
        this.ticketdbTemp.load()
    }

    /**
     * @param {string} type 
     * @param {string} guild 
     * @param {Array} dict 
     */
    async addinfo(type, guildID, dict){
        if (type == "setup"){
            await this.ticketdbTemp.push(`./${guildID}/setup`,dict,true)
            this.addinfo("ended", guildID, false)
        } else if (type == "categorias") {
            let ctg
            if (await this.ticketdbTemp.exists(`./${guildID}/categos`)){
                ctg = await this.ticketdbTemp.getData(`./${guildID}/categos`)
            } else {
                return await this.ticketdbTemp.push(`./${guildID}/categos`,[dict],true)
            }
            ctg.push(dict)
            await this.ticketdbTemp.push(`./${guildID}/categos`,ctg,true)
        } else if (type == "categoriasQnt"){
            await this.ticketdbTemp.push(`./${guildID}/qntCategos`, dict,true)
        } else if (type == "ended"){
            await this.ticketdbTemp.push(`./${guildID}/ended`,dict,true)
        }
    }

    async getinfos(guildID){
        if (await this.ticketdbTemp.exists(`./${guildID}`)){
            return await this.ticketdbTemp.getData(`./${guildID}`)
        } else {
            return false
        }
    }

    async delete(guildID){
        if (await this.ticketdbTemp.exists(`./${guildID}`)){
            await this.ticketdbTemp.delete(`./${guildID}`)
        }
    }
}

const tempdbTicket = new tempdbTicketClass()

module.exports = {
    tempdbTicket
}