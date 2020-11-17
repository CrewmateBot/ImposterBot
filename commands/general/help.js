const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const config = require("../../config.json");
const { sep } = require("path");

module.exports = {
    name: "help",
	description: "Sends you the list of commands that you can use, or more information about a specefic command.",
	useParams: "help [<command>]",
    useExample: "[prefix]help kick",
    useDesc: "This would show you more details about the kick command.",

    async execute(bot, message, args) {
		const commandToShow = args.slice(0).join(' ');
		
		var embed = new MessageEmbed()
		.setColor("#ff1010")
		.setAuthor(`${bot.user.username} Helper`, bot.user.displayAvatarURL())
		.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
		.setTimestamp();

		if (commandToShow) {
			if (bot.commands.has(commandToShow)) {
				var command = bot.commands.get(commandToShow);
				if (!command.userPermissions || message.member.hasPermission(command.userPermissions)) {
					embed.setTitle(`${command.name} command help`);

					if (command.description) 
						embed.addField("Description", command.description, true);
					if (command.useParams) 
						embed.addField("Parameters", command.useParams, true);

					if ((command.description || command.useParams) && (command.useExample || command.useDesc)) 
						embed.addField("\u200B", "\u200B");

					if (command.useExample)
						embed.addField("Example", command.useExample.replace("[prefix]", config.globalPrefix), true);
					if (command.useDesc) 
						embed.addField("Description", command.useDesc.replace("[prefix]", config.globalPrefix), true);
				} else {
					return message.reply("You don't have permissions to use this command, therefore you can't view the help info for it.");
				}
			} else {
				return message.reply(`I couldn't find the requested command "${commandToShow}", if you're unsure what the command is called, you can run !help without any parameters.`);
			}
		} else {
			const cmdDir = './commands/';
			embed.setDescription(`You can type ${config.globalPrefix}help <command> to get more information.\n**Example:** ${config.globalPrefix}help kick`);
			
			readdirSync(cmdDir).forEach(dirs => {
				const commands = readdirSync(`${cmdDir}${sep}${dirs}${sep}`).filter(files => files.endsWith(".js"));
				var parsedCommands = [];

				for (const file of commands) {
					const finalCommand = require(`../../${cmdDir}/${dirs}/${file}`);

					if (!finalCommand.userPermissions || message.member.hasPermission(finalCommand.userPermissions)) {
						parsedCommands.push(finalCommand.name);
					}
				}
			
				if (parsedCommands.length != 0)
					embed.addField(dirs.charAt(0).toUpperCase() + dirs.slice(1), parsedCommands.join(', '));
			});
		}

		return message.channel.send(embed);
    }
};