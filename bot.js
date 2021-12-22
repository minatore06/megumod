const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], partials: ["MESSAGE", "CHANNEL", "REACTION"] })
const Discord = require('discord.js')
const config = require('./config.json')
const fs = require('fs')

const token = config.token;

client.commands = new Discord.Collection()
client.events = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))
for(const file of commandFiles)
{
    const command = require(`./commands/${file}`)

    client.commands.set(command.name, command)
}

client.on('ready', () =>{
    console.log("Megumin online!");
})

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return

    const messageAr = message.content.slice(prefix.length).split(/ +/)
    const command = messageAr.shift().toLowerCase()
    const args = messageAr.slice(1)

    if (client.commands.has(commandName)){//switch o argomenti uguali (alias?)
        client.commands.get(commandName).execute(message, args, client);
    }
})

client.login(token)