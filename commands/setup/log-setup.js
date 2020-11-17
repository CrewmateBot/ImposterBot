const { MessageCollector } = require("discord.js");
const db = require('quick.db');

module.exports = {
    name: "log-setup",
    description: "Sets up logging on the server.",
    useParams: "log-setup <interactive> [<msg-log-channel>] [<mod-log-channel>]",
    useExample: "[prefix]log-setup false #message-logs #mod-logs",
    useDesc: "This would setup logging without the interactive setup to log in #message-logs and #mod-logs.",
    userPermissions: ["ADMINISTRATOR"],

    async execute(bot, message, args) {
        const interactive = args[0];

        if (interactive != null && interactive == "false") {
            if (db.get(`${message.guild.id}.isLogsSetup`))
                return message.reply("Logging is already setup on this server, please disable it before setting it up again.");

            const msgLogs = message.mentions.channels.first();
            const modLogs = message.mentions.channels.array()[1];

            if (msgLogs && modLogs) {
                message.channel.send(`All done! Message logs will now be sent in ${msgLogs} and moderation logs will be in ${modLogs}.`);

                db.set(`${message.guild.id}.isLogsSetup`, true);
                db.set(`${message.guild.id}.msgLogChannel`, msgLogs.id);
                db.set(`${message.guild.id}.modLogChannel`, modLogs.id);
            } else {
                return message.reply("You need to tage mention channels to perform this action, first message logs and second moderation log.");
            }
        } else {
            if (db.get(`${message.guild.id}.isLogsSetup`))
                return message.reply("Logging is already setup on this server, please disable it before setting it up again.");

            await message.channel.send("Beginning interactive log-setup, please reply to the questions in this channel.");
            await message.channel.send("In which channel do you want message logs to appear?");

            const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
            let msgChannel = null;
            let modChannel = null;

            collector.on("collect", msg => {
                if (!msgChannel) {
                    msgChannel = msg.mentions.channels.first();
                    if (msgChannel) {
                        msg.channel.send(`Got it. Message logs will now be sent in ${msgChannel}.`);
                        msg.channel.send("Where do you want moderation logs to be sent in?");
    
                        const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
                    }
                } else if (!modChannel) {
                    modChannel = msg.mentions.channels.first();

                    if (modChannel) {
                        msg.channel.send(`All done! Message logs will now be sent in ${msgChannel} and moderation logs will be in ${modChannel}.`);

                        db.set(`${message.guild.id}.isLogsSetup`, true);
                        db.set(`${message.guild.id}.msgLogChannel`, msgChannel.id);
                        db.set(`${message.guild.id}.modLogChannel`, modChannel.id);
                    }
                }
            });
        }
    }
};