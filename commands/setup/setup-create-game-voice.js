const db = require('quick.db');
const discord = require("discord.js")
module.exports = {
	name: "augamevoice",
    description: "The setup command for the game creation channel",
    useParams: "augamevoice <Channel-ID>",
    useExample: "[prefix]augamevoice 38246135543445215",
    useDesc: "This would set the channel with id 38246135543445215 to the channel you join to create games",
    userPermissions: ["ADMINISTRATOR"],

    /**
     * @param {Discord.Message} message 
     * @param {Array<string>} args 
     */
	execute(client, message, args) {
        message.delete();
        if (!args.length) return;        
        var id = args[0] + "";
        if(!message.guild.channels.cache.find((cat) => cat.id === id))
        {
            return;
        }
        db.set(message.guild.id + ".createGameVoice",id); 

        message.reply(args[0] + " has been set as the create games voice channel").then((message) => 
        {
            setTimeout(() => {
                message.delete();
            }, 3000);
        });
	},
};
