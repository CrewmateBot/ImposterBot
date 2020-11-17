const db = require('quick.db');
const twitch = require('../../twitch/api');

module.exports = {
    name: "cc-remove-game",
	description: "Remove a game from the allowed stream games.",
	useParams: "cc-remove-game <game_name>",
    useExample: "[prefix]cc-remove-game Among Us",
    useDesc: "This would remove the game called \"Among Us\" from the allowed games.",
    userPermissions: ["ADMINISTRATOR"],

    async execute(bot, message, args) {
        if (!db.get(`${message.guild.id}.isCreatorsSetup`)) return message.reply("The content creator feature isn't setup on this server yet. Please do that first.");

        const gameName = args.slice(0).join(' ');
        if (!gameName) return message.reply("You need to specify a game to remove.");

        const game = await twitch.getIdFromGame(gameName);
        if (!game || isNaN(game.id)) return message.reply("Invalid ID returned from Twitch API.");

        let oldGames = db.get(`${message.guild.id}.games`);
        let newGames = [];
        oldGames.forEach(element => {
            if (element != game.id)
                newGames.push(element);
        });

        db.set(`${message.guild.id}.games`, newGames);
        message.channel.send(`${gameName} (ID: ${game.id}) removed from allowed stream games.`);
    }
};