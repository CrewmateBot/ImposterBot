module.exports = {
    name: "kick",
    description: "Kicks an imposter from the guild.",
    useParams: "kick <user> <reason>",
    useExample: "[prefix]kick @Minisimp You're stupid",
    useDesc: "This would kick Minisimp from the Discord server, with the reason \"You're stupid\".",
    userPermissions: ["KICK_MEMBERS"],

    async execute(bot, message, args) {
        const user = message.mentions.members.first();
        const reason = args.slice(1).join(' ');

        if (user) 
            return message.reply("You need to mention a user to kick them.");

        if (user.bot)
            return message.reply(`Oh snap, I won't kick my fellow robots. If you really want them gone you'll have to do it yourself.`);

        if (!message.guild.member(user).bannable) 
            return message.reply("I don't have permissions to kick this user.");

        await user.send(`You have been kicked from ${message.guild.name} with the reason:\n${reason}`)
        .catch(err => message.channel.send(`${user.tag} has not been notified about their kick as I am unable to DM them.`));

        await user.kick(reason)
        .catch(err => message.channel.send(`An error occured trying to ban this user.`));

        message.channel.send(`${user} was An Imposter. (Kicked)`);
    }
};