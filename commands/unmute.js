module.exports =
{
    name: 'unmute',
    description: "Smuta un utente tramite tag o id",
    async execute(message, args, config, Discord)
    {
        let target = args[0]
        let reason = args.slice(1).join(" ")

        if(!target)return message.reply("Nessun utente menzionato")
        if(message.mentions.members.first())target = await message.mentions.members.first()
        else target = await message.guild.members.fetch(target)

        let ruolo = await message.guild.roles.fetch(config.muteRole)   
        if(!ruolo)return message.reply("Nessun ruolo per il mute")

        if(target.roles.cache.has(config.muteRole))
            await target.roles.remove(ruolo)
            .then(()=>{
                message.channel.send(`${target} smutato con successo`);
                message.delete();
            })
            .catch(err => {
                return message.reply(err.message);
            })
    }
}