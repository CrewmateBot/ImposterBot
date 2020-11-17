const db = require('quick.db');

module.exports = {
    name: "room-invite",
    description: "Allows someone to join a locked room, the username provided has to be the users actual username on discord (Not including tag).",
    useParams: "room-invite <username>",
    useExample: "[prefix]room-invite Minisoft",
    useDesc: "This would allow the user with the username \"Minisoft\" to join the room.",

    async execute(bot, message, args) {
        if (!args.length) return;

        if(!(db.get(message.guild.id + "." + message.channel.id + ".owner") == message.author.id))
        {
            message.reply("You're not the owner of this room, only the owner may invite people.");
            return;
        }

        let user = bot.users.cache.find(user => user.username == args[0]);
        if (!user) return message.reply("Couldn't find the requested user.");

        await message.member.voice.channel.updateOverwrite(user, { CONNECT: true });
        message.channel.send(`${user} is now allowed to join the channel.`);
    }
};