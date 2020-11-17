const db = require('quick.db');
const discord = require("discord.js")
module.exports = {
	name: "aunotifyrole",
    description: "The setup command for the notify role",
    useParams: "aunotifyrole <Name of Notify role>",
    useExample: "[prefix]aunotifyrole Notify",
    useDesc: "This would set the reaction role to the role with the name Notify",
    userPermissions: ["ADMINISTRATOR"],

    /**
     * 
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
	execute(client, message, args) {
        message.delete();
        if (!args.length) return;
        var id = args[0] + "";
        var role = message.guild.roles.cache.find((role) => role.name == args[0])
        if(!role)
        {
            return message.reply("Cannot find role with that name").then((message) => 
            {
                setTimeout(() => {
                    message.delete();
                }, 3000);
            });;
        }

        db.set(message.guild.id + ".notifyRoleID", role.id);
        message.reply(args[0] + " has been set as the notify role").then((message) => 
        {
            setTimeout(() => {
                message.delete();
            }, 3000);
        });
	},
};
