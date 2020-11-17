const { MessageCollector } = require("discord.js");
const db = require('quick.db');

module.exports = {
    name: "cc-setup",
    description: "Sets up the content creator system on the server.",
    useParams: "cc-setup <interactive> [<stream-channel>] [<creator-role>] [<live-role>]",
    useExample: "[prefix]cc-setup false #streams @Content Creators @LIVE",
    useDesc: "This would setup the content creator system, and have streams announced in #streams.",
    userPermissions: ["ADMINISTRATOR"],

    async execute(bot, message, args) {
        const interactive = args[0];

        if (interactive != null && interactive == "false") {
            if (db.get(`${message.guild.id}.isCreatorsSetup`))
                return message.reply("The content creator system is already setup on this server, destroy it first if you wish to redo the setup.");

            const streamChannel = message.mentions.channels.first();
            const creatorRole = message.mentions.roles.first();
            const liveRole = message.mentions.roles.array()[1];

            if (streamChannel && creatorRole) {
                db.set(`${message.guild.id}.isCreatorsSetup`, true);
                db.set(`${message.guild.id}.streamsChannel`, streamChannel.id);
                db.set(`${message.guild.id}.creatorRole`, creatorRole.id);

                if (liveRole)
                    db.set(`${message.guild.id}.liveRole`, liveRole.id);

                message.channel.send(`All done! Streams will be announced in ${streamChannel}, I will give content creators ${creatorRole}, and also assign them ${liveRole} when they go live.`);
            } else {
                return message.reply("Some of the parameters were incorrect, please check that you're mentioning everything in correct order.");
            }
        } else {
            if (db.get(`${message.guild.id}.isCreatorsSetup`))
                return message.reply("The content creator system is already setup on this server, destroy it first if you wish to redo the setup.");

            await message.channel.send("Beginning interactive cc-setup, please reply to the questions in this channel.");
            await message.channel.send("In which channel do you want me to announce streams?");

            const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
            let streamChannel = null;
            let creatorRole = null;
            let liveRole = null;

            collector.on("collect", msg => {
                if (!streamChannel) {
                    streamChannel = msg.mentions.channels.first();

                    if (streamChannel) {
                        msg.channel.send(`Got it. Streams will be announced in ${streamChannel}.`);
                        msg.channel.send("What role do you want me to give content creators?");
    
                        const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
                    }
                } else if (!creatorRole) {
                    creatorRole = msg.mentions.roles.first();

                    if (creatorRole) {
                        msg.channel.send(`Got it. They'll get the ${creatorRole} role upon becoming a content creator.`);
                        msg.channel.send("What role do you want me to give content creators when they go live? (Type 'none' if you don't want one)");
    
                        const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
                    }
                } else if (!liveRole) {
                    liveRole = msg.mentions.roles.first();

                    message.channel.send(`All done! Streams will be announced in ${streamChannel}, I will give content creators ${creatorRole}, and also assign them ${liveRole} when they go live.`);

                    db.set(`${message.guild.id}.isCreatorsSetup`, true);
                    db.set(`${message.guild.id}.streamsChannel`, streamChannel.id);
                    db.set(`${message.guild.id}.creatorRole`, creatorRole.id);

                    if (liveRole)
                        db.set(`${message.guild.id}.liveRole`, liveRole.id);
                }
            });
        }
    }
};