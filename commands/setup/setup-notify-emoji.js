const db = require('quick.db');
const discord = require("discord.js")
module.exports = {
	name: "aunotifyemoji",
    description: "The setup command for the notify emoji",
    useParams: "aunotifyemoji <Name of React Emoji>",
    useExample: "[prefix]aunotifyemoji Notify",
    useDesc: "This would set the reaction emoji to the emoji with the name Notify",
    userPermissions: ["ADMINISTRATOR"],
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
	execute(client, message, args) {
        message.delete();
        if (!args.length) return;
        var emoji = message.guild.emojis.cache.find((emoji) => emoji.name == args[0])
        if(!emoji)
        {
            return message.reply("Cannot find emoji with that name").then((message) => 
            {
                setTimeout(() => {
                    message.delete();
                }, 3000);
            });;
        }

        db.set(message.guild.id + ".notifyEmojiID", emoji.id);

        message.reply(args[0] + " has been set as the notify emoji").then((message) => 
        {
            setTimeout(() => {
                message.delete();
            }, 3000);
        });
	},
};
