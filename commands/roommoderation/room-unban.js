const db = require('quick.db');
const Discord = require("discord.js")

module.exports = {
	name: 'room-unban',
    description: 'Unbans a user from a room',
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

        message.member.voice.channel.updateOverwrite(member, {'CONNECT': true})

        message.reply(getNameOfUser(message.mentions.members.first()) + " was unbanned from the channel")
	},
};


function getNameOfUser(user)
{
    return user.nickname ? user.nickname : user.user.username;
}