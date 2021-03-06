const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { sep } = require("path");
const twitch = require("./twitch/creators");

const bot = new Client({partials:['MESSAGE', 'CHANNEL', "REACTION"]});
const config = require("./config.json");
bot.commands = new Collection();
bot.aliases = new Collection();

const loadCommands = (dir = "./commands/") => {
    readdirSync(dir).forEach(dirs => {
        const commands = readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files => files.endsWith(".js"));

        for (const file of commands) {
            const finalCommand = require(`${dir}/${dirs}/${file}`);
            bot.commands.set(finalCommand.name, finalCommand);
        }
    });
};
loadCommands();

const loadEvents = (dir = "./events/") => {
    const commands = readdirSync(`${dir}${sep}`).filter(files => files.endsWith(".js"));

    for (const file of commands) {
        const finalCommand = require(`${dir}/${file}`);
        
        bot.on(file.replace(".js", ""), (...args) => {
            finalCommand.eventHandler(bot, ...args);
        });
    }
};
loadEvents();

function checkStreams() {
    bot.guilds.cache.forEach(guild => {
        twitch.checkStreams(bot, guild.id);
    });

    setTimeout(checkStreams, config.twitch.recheckRate);
}
setTimeout(checkStreams, config.twitch.recheckRate);

function pickRandom(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

bot.on("ready", () => {
    console.log(`Imposter bot is ready, logged in as: ${bot.user.tag}`);

    function updateStatus() {
        var statusNum = pickRandom(config.statues.length);
        var status = config.statues[statusNum];

        if (status.includes("[color]")) {
            var colorNum = pickRandom(config.colors.length);
            status = status.replace("[color]", config.colors[colorNum]);
        }

        if (status.includes("[location]")) {
            var locNum = pickRandom(config.places.length);
            status = status.replace("[location]", config.places[locNum])
        }

        bot.user.setActivity(status);

        setTimeout(updateStatus, 60000);
    }

    updateStatus();
});

bot.on("message", async message => {
    const prefix = config.globalPrefix;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    let command;

    if (message.author.bot)
        return;

    if (!message.guild) {
        message.reply("I don't read private messages from potential Imposters like yourself.");
        return;
    }

    if (!message.member) 
        message.member = await message.guild.fetchMember(message.author);
    
    if (!message.content.startsWith(prefix))
        return;
    if (cmd.length === 0) 
        return;

    if (bot.commands.has(cmd)) 
        command = bot.commands.get(cmd);
    else if (bot.aliases.has(cmd) && !command) 
        command = bot.commands.get(bot.aliases.get(cmd));
    
    if (command) {
        try {
            if (!command.userPermissions || message.member.hasPermission(command.userPermissions)) {
                command.execute(bot, message, args);
            } else {
                message.reply(`You don't have the required permissions to execute this command.\nRequired Permission(s): ${command.userPermissions}`);
            }
        } catch (err) {
            message.channel.send(`Error caught executing '${cmd}': ${err}`);
        }
    }
});

bot.login(config.token).catch(console.error());