const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports.eventHandler = async (client, guild, user) => {
    if (db.get(`${guild.id}.isLogsSetup`)) {
        const modLogs = client.channels.cache.get(db.get(`${guild.id}.modLogChannel`));

        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        });

        const banLog = fetchedLogs.entries.first();
        let bannedBy = null;

        if (banLog) {
            const { executor, target } = banLog;

            if (target.id === user.id && (Date.now() - banLog.createdTimestamp) < 500)
                bannedBy = executor;
        }

        var embed = new MessageEmbed()
        .setColor("#ff1900")
        .setAuthor(`Member Banned`, user.displayAvatarURL())
        .setTimestamp()
        .addFields(
            { name: 'Member', value: user }
        );
        
        if (bannedBy)
            embed.addField("Banned By", bannedBy);

        modLogs.send(embed);
    }
};