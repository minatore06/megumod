const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_WEBHOOKS], partials: ["MESSAGE", "CHANNEL", "REACTION"] })
const Discord = require('discord.js')
const config = require('./config.json')
const fs = require('fs')

const token = config.token;
const prefix = config.prefix;

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

client.on('messageCreate', async message => {
    if(/* !message.content.startsWith(prefix) || */ message.author.bot) return

    const args = message.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase()

    if (client.commands.has(command)){//switch o argomenti uguali (alias?)
        client.commands.get(command).execute(message, args, config, Discord)
    }
})

client.on('error', error => {
    console.log(error)
})

client.login(token)