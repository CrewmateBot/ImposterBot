const db = require('quick.db');

module.exports = {
    name: "cc-remove",
	description: "Removes someone from being a content creator.",
	useParams: "cc-remove <@User>",
    useExample: "[prefix]cc-remove @Minisimp",
    useDesc: "This would remove Minisimp from being a content creator, and would no longer announce their streams.",
    userPermissions: ["ADMINISTRATOR"],
    
    async execute(bot, message, args) {
        if (!db.get(`${message.guild.id}.isCreatorsSetup`)) return message.reply("The content creator feature isn't setup on this server yet. Please do that first.");

        const user = message.mentions.members.first();
        if (!user) return;

        let oldCreators = db.get(`${message.guild.id}.creators`);
        let newCreators = [];
        oldCreators.forEach(element => {
            let discordId = element.substr(0, element.indexOf(':'));
            if (discordId != user.id)
                newCreators.push(element);
        });

        const creatorRole = message.guild.roles.cache.get(db.get(`${message.guild.id}.creatorRole`));
        if (creatorRole)
            user.roles.remove(creatorRole);

        db.set(`${message.guild.id}.creators`, newCreators);
        message.channel.send(`${user} has been removed as a content creator.`);
    }
};