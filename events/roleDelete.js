const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports.eventHandler = async (client, role) => {
    if (db.get(`${role.guild.id}.isLogsSetup`)) {
        const modLogs = client.channels.cache.get(db.get(`${role.guild.id}.modLogChannel`));

        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: 'ROLE_DELETE',
        });

        const deletionLog = fetchedLogs.entries.first();
        let roleDeletor = "Unknown";

        if (deletionLog) {
            const { executor, target } = deletionLog;

            if (target.id === role.id && (Date.now() - deletionLog.createdTimestamp) < 500)
                roleDeletor = executor;
        }

        let url = client.user.displayAvatarURL();
        if (roleDeletor != "Unknown")
            url = roleDeletor.displayAvatarURL();

        var embed = new MessageEmbed()
        .setColor("#ff1900")
        .setAuthor(`Role Deleted`, url)
        .setTimestamp()
        .addFields(
            { name: 'Role Name', value: role.name },
            { name: 'Role Color', value: role.hexColor },
            { name: 'Role Hoisted', value: role.hoist },
            { name: 'Deleted By', value: roleDeletor },
            { name: 'Permissions', value: role.permissions.toArray().join("\n") }
        );

        modLogs.send(embed);
    }
};