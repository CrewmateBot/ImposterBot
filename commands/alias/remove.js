module.exports = {
    name: "alias-remove",
    description: "Removes an alias for a certain command",
    useParams: "alias-remove <alias>",
    useExample: "[prefix]alias-remove eject",
    useDesc: "This would remove the alias called eject, making it unusable.",
    userPermissions: ["MANAGE_CHANNELS"],

    async execute(bot, message, args) {
        const aliasName = args[0];

        if (!aliasName) 
            return message.reply("No valid alias provided.");

        if (!bot.aliases.get(aliasName))
            return message.reply("There's not an alias by this name.");

        if (bot.commands.get(aliasName))
            return message.reply("There's a command with this name, only aliases can be removed with this command.");

        bot.aliases.delete(aliasName);
        message.reply("The alias was removed.");
    }
};