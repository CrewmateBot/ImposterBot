const { MessageEmbed } = require("discord.js");
const package = require("../../package.json");

module.exports = {
    name: "info",
	description: "Gives you some general information about the bot.",
	useParams: "info",
    useExample: "[prefix]info",
    useDesc: "This would send the info embed in the channel you typed it in.",

    async execute(bot, message, args) {
        let as = bot.users.cache.get('132876342428434432');
        let walter = bot.users.cache.get('547587388159950898');

		var embed = new MessageEmbed()
		.setColor("#ff1010")
		.setAuthor(`${bot.user.username} Information`, bot.user.displayAvatarURL())
		.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
        .addFields(
            { name: ':robot: Bot Version', value: package.version, inline: true },
            { name: ':busts_in_silhouette: Authors', value: `${as}, ${walter}`, inline: true },
            { name: ':homes: Official Server', value: "[Join Server](https://discord.gg/NfDHa4T)", inline: true },
        );

		return message.channel.send(embed);
    }
};