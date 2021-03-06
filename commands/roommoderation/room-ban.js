const db = require('quick.db');
const Discord = require("discord.js")

module.exports = {
	name: 'room-ban',
    description: 'Bans a user from a room',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
	execute(client, message, args) {
        if (!args.length) return;
        
        if(!(db.get(message.guild.id + "." + message.channel.id + ".owner") == message.author.id))
        {
            return;
        }
        var member = message.mentions.members.first();

        message.reply(getNameOfUser(message.mentions.members.first()) + " was banned from the channel")

        member.voice.kick()

        message.member.voice.channel.updateOverwrite(member,{'CONNECT': false})

	},
};


function getNameOfUser(user)
{
    return user.nickname ? user.nickname : user.user.username;
}