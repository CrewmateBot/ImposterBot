const db = require('quick.db');
const Discord = require("discord.js")

module.exports = {
	name: 'room-kick',
    description: 'Kicks a user from a room',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
	execute(client, message, args) {
        if (!args.length) return;
        
        if(!(db.get(message.guild.id + "." + message.channel.id + ".owner") == message.author.id))
        {
            console.log("notowner")
            return;
        }

        message.reply(getNameOfUser(message.mentions.members.first()) + " was kicked from the channel")
        message.mentions.members.first().voice.kick();
	},
};


function getNameOfUser(user)
{
    return user.nickname ? user.nickname : user.user.username;
}