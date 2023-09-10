const moment = require("moment-timezone")
const fs = require("fs")

const logger = new class {

    error(err){
        let date = moment(Date.now().valueOf()).tz("America/Sao_Paulo")
        fs.writeFile(
            `loggerErr.txt`,
            this.getLogs("Err") + `\n${date.format("DD/MM/YYYY HH:mm:ss")}\n${err}`,
            (e) => {}
        )
    }

    getLogs(type) {

        let content;

        try {

            content = fs.readFileSync(`logger${type}.txt`, {encoding: "utf-8"})

            if (content == undefined){
                throw Error("logger error not found")
            }

        } catch (err) {
            content = ""
        }

        return content
    }

    clear(){

        try {

            fs.writeFile("loggerErr.txt", "", (e)=>{})
            fs.writeFile("loggerUsage.txt", "", (e)=>{})

        } catch (err){
            this.error(err)
        }
    }

    usage(user, commandName){

        let date = moment(Date.now().valueOf()).tz("America/Sao_Paulo")

        try {
            fs.writeFile(
                "loggerUsage.txt",
                this.getLogs("Usage") + `Usuario ${user.displayName} CommandName ${commandName} data: ${date.format("DD/MM/YYYY HH:mm:ss")}\n`,
                (e) => {}
            )
        } catch (err){
            this.error(err)
        }
    }

}

module.exports = logger