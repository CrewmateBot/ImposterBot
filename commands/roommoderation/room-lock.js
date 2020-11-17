const db = require('quick.db');

module.exports = {
    name: "room-lock",
    description: "Locks the room to prevet people joining without being invited.",

    async execute(bot, message, args) {        
        if(!(db.get(message.guild.id + "." + message.channel.id + ".owner") == message.author.id))
        {
            message.reply("You're not the owner of this room, only the owner may change the settings.");
            return;
        }

        await message.member.voice.channel.updateOverwrite(message.guild.roles.everyone, { CONNECT: false });
        message.channel.send("This room is now locked :lock:");
    }
};