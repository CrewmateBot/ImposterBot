const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports.eventHandler = async (client, message) => {
    if (!message.guild) 
        return;

    if (db.get(`${message.guild.id}.isLogsSetup`) && message.content) {
        const msgLogs = client.channels.cache.get(db.get(`${message.guild.id}.msgLogChannel`));

        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_DELETE',
        });

        const deletionLog = fetchedLogs.entries.first();
        let messageDeleter = null;

        if (deletionLog) {
            const { executor, target } = deletionLog;

            if (target.id === message.author.id && (Date.now() - deletionLog.createdTimestamp) < 500)
                messageDeleter = executor;
        }

        let url = client.user.displayAvatarURL();
        if (messageDeleter)
            url = messageDeleter.displayAvatarURL();

        var embed = new MessageEmbed()
        .setColor("#ff1900")
        .setAuthor(`Messaged Deleted`, url)
        .setFooter(`Message by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
        .addFields(
            { name: 'Message Content', value: message.content },
            { name: 'In Channel', value: message.channel },
        );

        if (messageDeleter)
            embed.addField("Deleted By", messageDeleter);

        msgLogs.send(embed);
    }
};