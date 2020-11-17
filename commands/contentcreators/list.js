const db = require('quick.db');
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "cc-list",
	description: "Lists all the current content creators.",
    userPermissions: ["ADMINISTRATOR"],

    async execute(bot, message, args) {
        if (!db.get(`${message.guild.id}.isCreatorsSetup`)) return message.reply("The content creator feature isn't setup on this server yet. Please do that first.");

        let creators = db.get(`${message.guild.id}.creators`);

        var embed = new MessageEmbed()
		.setColor("#ff1010")
		.setAuthor(`${bot.user.username} Content Creators`, bot.user.displayAvatarURL())
        
        creators.forEach(element => {
            const user = bot.users.cache.get(element.substr(0, element.indexOf(':')));
            embed.addField(`${user.tag}`, `ID: ${element.substr(element.indexOf(':') + 1, element.length - 1)}`, true);
        });

        message.channel.send(embed);
    }
};