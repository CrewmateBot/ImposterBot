const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports.eventHandler = async (client, messages) => {
    if (db.get(`${messages.guild.id}.isLogsSetup`) && messages.content) {
        const msgLogs = client.channels.cache.get(db.get(`${messages.guild.id}.msgLogChannel`));
        // TODO
    }
};