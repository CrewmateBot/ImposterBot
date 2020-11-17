module.exports = {
    name: "ban",
    description: "Bans an imposter from the guild.",
    useParams: "ban <user> <time> <reason>",
    useExample: "[prefix]ban @Minisimp 0 You're stupid",
    useDesc: "This would ban Minisimp permanently from the Discord server, with the reason \"You're stupid\".",
    userPermissions: ["BAN_MEMBERS"],

    async execute(bot, message, args) {
        const user = message.mentions.members.first();
        let time = args[1];
        let reason = null;

        if (time) {
            reason = args.slice(2).join(' ');
        } else {
            reason = args.slice(1).join(' ');
            time = 0;
        }
        
        if (!user) 
            return message.reply("You need to mention a user to ban them.");

        if (user.bot) 
            return message.reply(`Oh snap, I won't ban my fellow robots. If you really want them gone you'll have to do it yourself.`);

        if (!message.guild.member(user).bannable) 
            return message.reply("I don't have permissions to ban this user.");

        await user.send(`You have been banned from ${message.guild.name} with the reason:\n${reason}`)
        .catch(err => message.channel.send(`${user.tag} has not been notified about their ban as I am unable to DM them.`));

        await user.ban({days: time, reason: `${message.author.tag}: ${reason}`})
        .catch(err => message.channel.send(`An error occured trying to ban this user.`));

        message.channel.send(`${user} was An Imposter. (Banned)`);
    }
};