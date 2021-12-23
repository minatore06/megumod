const { MessageEmbed } = require('discord.js')
const ms = require('ms')

module.exports =
{
    name: 'mute',
    description: "Muta un utente tramite tag o id temporaneamente o un tempo di default",
    async execute(message, args, config, Discord)
    {
        let target = args[0]
        let tempo = args[1]
        let reason = args.slice(2).join(" ")
        
        if(!target)return message.reply("Nessun utente menzionato")
        if(message.mentions.members.first())target = await message.mentions.members.first()
        else target = await message.guild.members.fetch(target)

        let ruolo = await message.guild.roles.fetch(config.muteRole)   
        if(!ruolo)return message.reply("Nessun ruolo per il mute")

        if(target.roles.cache.has(config.muteRole))return message.reply("Utente già mutato")
        await target.roles.add(ruolo)
        .then(()=>{
            if(tempo)
            setTimeout(()=>{
                if(target.roles.cache.has(config.muteRole))
                    target.roles.remove(ruolo).catch(err =>{
                        return message.reply(err.message)
                    })
            }, ms(tempo))

            //log...
            let output = `${target} è stato mutato per ${tempo}`;
            if(reason)output+=`, motivazione:\n${reason}`;
            message.channel.send(output);

            //embed log
            let embed = new Discord.MessageEmbed({
                title:"Membro mutato",
                fields:[{
                    name:"Target",
                    value:`${target}, id:${target.id}`,
                    inline: true
                },{
                    name:"Moderatore",
                    value:`${message.author}, id:${message.author.id}`,
                    inline: true
                },{
                    name:"Motivazione",
                    value:`${reason?reason:"Nessuna motivazione specificata"}`,
                    inline: false
                },{
                    name:"Durata",
                    value:`${tempo}`,
                    inline: true
                }],
                timestamp: new Date()
            })
            message.channel.send({embeds:[embed]});
            message.delete();

        })
        .catch(err =>{
            message.reply(err.message);
        })  
    }
}