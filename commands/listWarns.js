const fs = require('fs')

module.exports = 
{
    name:'listwarns',
    description:'Aggiunge un warn ad un utente per salvare un comportamento scorretto',
    async execute(message, args, config, Discord)
    {
        let target = args[0]

        if(!args[0])target = 0;
        else{
            try {
                if(message.mentions.members.first())target = await message.mentions.members.first()
                else target = await message.guild.members.fetch(target)
            } catch (error) {
                message.reply("Utente non trovato")
            }
        }
        let warnsEmbed = new Discord.MessageEmbed()
        
        warnsEmbed.setTitle(`Warnings di ${target?target.displayName:message.guild.name}`)

        createWarnEmbed(target, message, (warns) =>{
            warnsEmbed.setDescription(warns)
    
            message.channel.send({embeds:[warnsEmbed]})
        })
        
    }
}

function createWarnEmbed(target, message, callback){
    var warns = "";
    
    fs.readFile('./warnings.json', async (err, data) => {
        if(err)return console.log(err)
        let warnings = JSON.parse(data);

        let mod;
        let user;
        Object.keys(warnings).forEach(async id => {
            if(warnings[id].target==target.id || !target){
                user = await message.guild.members.fetch(warnings[id].target)
                mod = await message.guild.members.fetch(warnings[id].moderator)    
                warns = warns.concat(`**ID**: ${id} ${target?"":`| **Utente**: ${user?user:warnings[id].target}`} | **Moderatore**: ${mod?mod:warnings[id].moderator}\n **Motivo**: ${warnings[id].comment}  -  ${new Date(warnings[id].date).toDateString()}\n`)
            }
            if(Object.keys(warnings).at(-1) == id)callback(warns)
        })
    })
}