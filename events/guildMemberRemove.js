const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports.eventHandler = async (client, member) => {
    if (db.get(`${member.guild.id}.isLogsSetup`)) {
        const modLogs = client.channels.cache.get(db.get(`${member.guild.id}.modLogChannel`));

        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });

        const kickLog = fetchedLogs.entries.first();
        let leavingReason = null;

        if (kickLog) {
            const { executor, target } = kickLog;

            if (target.id === member.id && (Date.now() - kickLog.createdTimestamp) < 500)
                leavingReason = executor;
        }

        var embed = new MessageEmbed()
        .setColor("#ff1900")
        .setAuthor(`Member Left`, member.user.displayAvatarURL())
        .setTimestamp()
        .addFields(
            { name: 'Member', value: member }
        );
        
        if (leavingReason)
            embed.addField("Kicked By", leavingReason);

        modLogs.send(embed);
    }
};