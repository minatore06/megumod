const fs = require('fs')

module.exports = 
{
    name:'warn',
    description:'Aggiunge un warn ad un utente per salvare un comportamento scorretto',
    async execute(message, args, config, Discord)
    {
        let target = args[0]
        let comment = args.slice(1).join(" ")

        try {
            if(message.mentions.members.first())target = await message.mentions.members.first()
            else target = await message.guild.members.fetch(target)
        } catch (error) {
            return message.reply("Nessun utente menzionato")
        }

        let warn = {
            target:target.id,
            moderator:message.author.id,
            comment:comment,
            date:new Date()
        };

        fs.readFile('./warnings.json', (err, data) => {
            if(err)return console.log(err)
            let warnings = JSON.parse(data);

            warnings[parseInt(Object.keys(warnings).at(-1))+1] = warn;
            fs.writeFile('./warnings.json', JSON.stringify(warnings), (err) => {
                if(err)return console.log(err)
                message.channel.send(`${target} warnato per \`${comment}\``);
                message.delete();
            })

        })
    }
}