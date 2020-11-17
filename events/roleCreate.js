const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports.eventHandler = async (client, role) => {
    if (db.get(`${role.guild.id}.isLogsSetup`)) {
        const modLogs = client.channels.cache.get(db.get(`${role.guild.id}.modLogChannel`));

        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: 'ROLE_CREATE',
        });

        const creationLog = fetchedLogs.entries.first();
        let roleCreator = "Unknown";

        if (creationLog) {
            const { executor, target } = creationLog;

            if (target.id === role.id && (Date.now() - creationLog.createdTimestamp) < 500)
                roleCreator = executor;
        }

        let url = client.user.displayAvatarURL();
        if (roleCreator != "Unknown")
            url = roleCreator.displayAvatarURL();

        var embed = new MessageEmbed()
        .setColor("#00bf29")
        .setAuthor(`Role Created`, url)
        .setTimestamp()
        .addFields(
            { name: 'Role Name', value: role.name },
            { name: 'Role Color', value: role.hexColor },
            { name: 'Role Hoisted', value: role.hoist },
            { name: 'Created By', value: roleCreator },
            { name: 'Permissions', value: role.permissions.toArray().join("\n") }
        );

        modLogs.send(embed);
    }
};