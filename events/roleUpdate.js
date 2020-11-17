const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports.eventHandler = async (client, oldRole, newRole) => {
    if (oldRole.name == newRole.name && oldRole.hexColor == newRole.hexColor && oldRole.hoist == newRole.hoist && oldRole.permissions == newRole.permissions)
        return;

    if (db.get(`${oldRole.guild.id}.isLogsSetup`)) {
        const modLogs = client.channels.cache.get(db.get(`${oldRole.guild.id}.modLogChannel`));

        const fetchedLogs = await oldRole.guild.fetchAuditLogs({
            limit: 1,
            type: 'ROLE_UPDATE',
        });

        const updateLog = fetchedLogs.entries.first();
        let roleUpdater = "Unknown";

        if (updateLog) {
            const { executor, target } = updateLog;

            if (target.id === oldRole.id && (Date.now() - updateLog.createdTimestamp) < 500)
                roleUpdater = executor;
        }

        let url = client.user.displayAvatarURL();
        if (roleUpdater != "Unknown")
            url = roleUpdater.displayAvatarURL();

        var embed = new MessageEmbed()
        .setColor("#00a6ff")
        .setAuthor(`Role Updated`, url)
        .setTimestamp()
        .addFields(
            { name: 'Updated By', value: roleUpdater },
            { name: 'Old Name', value: oldRole.name, inline: true },
            { name: 'New Name', value: newRole.name, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: 'Old Color', value: oldRole.hexColor, inline: true },
            { name: 'New Color', value: newRole.hexColor, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: 'Old Hoisted', value: oldRole.hoist, inline: true },
            { name: 'New Hoisted', value: newRole.hoist, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: 'Permissions', value: oldRole.permissions.toArray().join("\n"), inline: true },
            { name: 'Permissions', value: newRole.permissions.toArray().join("\n"), inline: true }
        );

        modLogs.send(embed);
    }
};