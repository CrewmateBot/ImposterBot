const db = require('quick.db');
const twitch = require('../../twitch/api');

module.exports = {
    name: "cc-add-game",
	description: "Adds a game to the allowed stream games.",
	useParams: "cc-add-game <game_name>",
    useExample: "[prefix]cc-add-game Among Us",
    useDesc: "This would add the game called \"Among Us\" to the allowed games.",
    userPermissions: ["ADMINISTRATOR"],

    async execute(bot, message, args) {
        if (!db.get(`${message.guild.id}.isCreatorsSetup`)) return message.reply("The content creator feature isn't setup on this server yet. Please do that first.");

        const gameName = args.slice(0).join(' ');
        if (!gameName) return message.reply("You need to specify a game to add.");

        const game = await twitch.getIdFromGame(gameName);
        if (!game || isNaN(game.id)) return message.reply("Invalid ID returned from Twitch API.");

        if (!db.has(`${message.guild.id}.games`))
            db.set(`${message.guild.id}.games`, [ `${game.id}` ]);
        else
            db.push(`${message.guild.id}.games`, `${game.id}`);

        message.channel.send(`${game.name} (ID: ${game.id}) added to allowed stream games.`);
    }
};