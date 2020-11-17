const db = require('quick.db');

module.exports = {
    name: "room-unlock",
    description: "Unlocks the room, allowing people to join again.",

    async execute(bot, message, args) {        
        if(!(db.get(message.guild.id + "." + message.channel.id + ".owner") == message.author.id))
        {
            message.reply("You're not the owner of this room, only the owner may change the settings.");
            return;
        }

        await message.member.voice.channel.updateOverwrite(message.guild.roles.everyone, { CONNECT: true });
        message.channel.send("This room is now unlocked :unlock:");
    }
};