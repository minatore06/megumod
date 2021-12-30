const fs = require('fs')

module.exports = 
{
    name:'delwarn',
    description:'Aggiunge un warn ad un utente per salvare un comportamento scorretto',
    async execute(message, args, config, Discord)
    {
        let id = args[0]
        let reason = args.slice(1).join(" ")

        if(!id)return message.reply("Nessun id specificato");
        if(!reason)return message.reply("Nessuna motivazione specificata");

        fs.readFile('./warnings.json', (err, data) => {
            if(err)return console.log(err)
            let warnings = JSON.parse(data);

            if(!warnings[id])return message.reply("Warn inesistente")
            let warn = warnings[id]
            delete warnings[id]
            message.channel.send(`Warn \`${id}\` rimosso con successo`)
            message.delete()
        })
    }
}