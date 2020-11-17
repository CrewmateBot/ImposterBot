const db = require('quick.db');
const discord = require("discord.js")
module.exports = {
	name: "aucategory",
    description: "The setup command for the category where games are put",
    useParams: "aucategory <Category-ID>",
    useExample: "[prefix]aucategory 38246135543445215",
    useDesc: "This would set the category 38246135543445215 to the category where game channels go",
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
        if(!message.guild.channels.cache.find((cat) => cat.id === id))
        {
            return message.reply("Cannot find channel with that id in this server").then((message) => 
            {
                setTimeout(() => {
                    message.delete();
                }, 3000);
            });;;
        }
        else if(id.match("[0-9]{18}"))
        {
            db.set(message.guild.id + ".categoryID",id);
            message.reply("Server category to create channels in set to: " + id).then((message) => 
            {
                setTimeout(() => {
                    message.delete();
                }, 3000);
            });;
        }
	},
};
