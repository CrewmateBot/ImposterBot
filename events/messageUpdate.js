const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports.eventHandler = async (client, oldMessage, newMessage) => {
    if (oldMessage.content == newMessage.content) // Embeded Preview Updates
        return;

    if (db.get(`${oldMessage.guild.id}.isLogsSetup`) && oldMessage.content && newMessage.content) {
        const msgLogs = client.channels.cache.get(db.get(`${oldMessage.guild.id}.msgLogChannel`));

        var embed = new MessageEmbed()
        .setColor("#fc8403")
        .setAuthor(`Messaged Edited`, oldMessage.author.displayAvatarURL())
        .setFooter(`Edited by ${oldMessage.author.tag}`)
        .setTimestamp()
        .addFields(
            { name: 'Original Message', value: oldMessage.content },
            { name: 'Edited Message', value: newMessage.content },
            { name: 'In Channel', value: newMessage.channel },
        );

        msgLogs.send(embed);
    }
};