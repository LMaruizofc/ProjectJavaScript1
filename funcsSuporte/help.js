const fs = require("fs")

function getModCommands(){

    let s = "";
    const modcmd = fs.readdirSync(`./commands/moderation`).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
    modcmd.forEach(commandName =>{
        if (s.indexOf("moderation") == -1){
            s += "\n**moderation**\n"
        }
        let cmd = require(`../commands/moderation/${commandName}`)
        if (cmd.name && s.indexOf(`- ${cmd.name}`) == -1){
            s += `- ${cmd.name}: ${cmd.description}\n`
            if (cmd.aliases && cmd.aliases.length > 0){
                s += `- - aliases: ${cmd.aliases}\n\n`
            }
        };
        
    });

    return s
};

function getGeraisCommands(){

    let s = "";
    const geraiscmd = fs.readdirSync(`./commands/gerais`).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
    geraiscmd.forEach(commandName =>{
        if (s.indexOf("Gerais") == -1){
            s += "\n**Gerais**\n"
        }
        let cmd = require(`../commands/gerais/${commandName}`)
        if (cmd.name && s.indexOf(`- ${cmd.name}`) == -1){
            s += `- ${cmd.name}: ${cmd.description}\n`
            if (cmd.aliases && cmd.aliases.length > 0){
                s += `- - aliases: ${cmd.aliases}\n\n`
            }
        };
        
    });

    return s
};

function getEventoCommands(){

    let s = "";
    const eventocmd = fs.readdirSync(`./commands/evento`).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
    eventocmd.forEach(commandName =>{
        if (s.indexOf("Evento") == -1){
            s += "\n**Evento**\n"
        }
        let cmd = require(`../commands/evento/${commandName}`)
        if (cmd.name && s.indexOf(`- ${cmd.name}`) == -1){
            s += `- ${cmd.name}: ${cmd.description}\n`
            if (cmd.aliases && cmd.aliases.length > 0){
                s += `- - aliases: ${cmd.aliases}\n\n`
            }
        };
        
    });

    return s
};

function getRegistroCommands(){

    let s = "";
    const registrocmd = fs.readdirSync(`./commands/registro`).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
    registrocmd.forEach(commandName =>{
        if (s.indexOf("Registro") == -1){
            s += "\n**Registro**\n"
        }
        let cmd = require(`../commands/registro/${commandName}`)
        if (cmd.name && s.indexOf(`- ${cmd.name}`) == -1){
            s += `- ${cmd.name}: ${cmd.description}\n`
            if (cmd.aliases && cmd.aliases.length > 0){
                s += `- - aliases: ${cmd.aliases}\n\n`
            }
        };
        
    });

    return s

};

function getTicketCommands(){

    let s = "";
    const ticketcmd = fs.readdirSync(`./commands/ticket`).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
    ticketcmd.forEach(commandName =>{
        if (s.indexOf("Ticket") == -1){
            s += "\n**Ticket**\n"
        }
        let cmd = require(`../commands/ticket/${commandName}`)
        if (cmd.name && s.indexOf(`- ${cmd.name}`) == -1){
            s += `- ${cmd.name}: ${cmd.description}\n`
            if (cmd.aliases && cmd.aliases.length > 0){
                s += `- - aliases: ${cmd.aliases}\n\n`
            }
        };
        
    });

    return s

};

module.exports = {
    getAllCommands(){

        let h = ""
    
        h += getModCommands();
        h += getGeraisCommands();
        h += getEventoCommands();
        h += getRegistroCommands();
        h += getTicketCommands();
    
        return {
            name: "Meus comandos",
            description: h
        }
    }
}