const db = require('quick.db');

module.exports = {
    name: "room-transfer",
    description: "This will transfer the ownership of the room to someone else. This cannot be undone.",
    useParams: "room-transfer <@User>",
    useExample: "[prefix]room-transfer @Minisimp",
    useDesc: "This would transfer the room to the user you tagged, which in this case is Minisimp.",

    async execute(bot, message, args) {
        if (!args.length) return;

        if(!(db.get(message.guild.id + "." + message.channel.id + ".owner") == message.author.id))
        {
            message.reply("You're not the owner of this room, only the current owner may transfer ownership.");
            return;
        }
        
        var member = message.mentions.members.first();
        if (!member) return;

        db.set(message.guild.id + "." + message.channel.id + ".owner", member.id);
        await message.channel.setName(`${getNameOfUser(member)}s-game`);
        await message.member.voice.channel.setName(`${getNameOfUser(member)}'s game`);

        message.channel.send(`This channels ownership has been transferred to ${member}, room moderation will now be done by them.`);
    }
};

function getNameOfUser(user)
{
    return user.nickname ? user.nickname : user.user.username;
}