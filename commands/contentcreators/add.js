const db = require('quick.db');
const twitch = require('../../twitch/api');

module.exports = {
    name: "cc-add",
	description: "Adds someone as a content creator.",
	useParams: "cc-add <@User> <twitch_id>",
    useExample: "[prefix]cc-add @Minisimp minisimp",
    useDesc: "This would add Minisimp as a content creator, and announce lives on the twitch account \"minisimp\".",
    userPermissions: ["ADMINISTRATOR"],

    async execute(bot, message, args) {
        if (!db.get(`${message.guild.id}.isCreatorsSetup`)) return message.reply("The content creator feature isn't setup on this server yet. Please do that first.");

        const user = message.mentions.members.first();
        if (!user || !args[1]) return;

        const twitchId = await twitch.getIdFromUsername(args[1]);
        if (!twitch || isNaN(twitchId)) return;

        if (!db.has(`${message.guild.id}.creators`))
            db.set(`${message.guild.id}.creators`, [ `${user.id}:${twitchId}` ]);
        else
            db.push(`${message.guild.id}.creators`, `${user.id}:${twitchId}`);

        const creatorRole = message.guild.roles.cache.get(db.get(`${message.guild.id}.creatorRole`));
        if (creatorRole)
            user.roles.add(creatorRole);

        message.channel.send(`${user} was added as a content creator, I will now notify when when they go live.`);
    }
};