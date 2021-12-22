module.exports =
{
    name: 'ping',
    description: "Pong!",
    execute(message, args, client)
    {
        message.reply("Pong!")
    }
}