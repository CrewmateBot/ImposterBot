const { MessageEmbed } = require("discord.js");
const twitch = require('./api');
const db = require('quick.db');

let liveCreators = [];

function sendLiveEmbed(user, channel, streamData) {
    let imageUrl = streamData.thumbnail_url.replace("{width}", "400");
    imageUrl = imageUrl.replace("{height}", "250");

    var embed = new MessageEmbed()
    .setColor("#6441a5")
    .setAuthor(`${user.username} - Official Content Creator`, user.displayAvatarURL())
    .setTitle(`${streamData.user_name} is now live on Twitch!`)
    .setImage(imageUrl)
    .setURL(`https://twitch.tv/${streamData.user_name}`)
    .setDescription(streamData.title);

    channel.send(embed).then((message) =>
    {
        liveCreators.push(`${user.id}:${message.id}`);
    });
}

function removeLiveEmbed(channel, userId) {
    let messageId = null;

    liveCreators.forEach((element, index, object) => {
        const creatorId = element.substr(0, element.indexOf(':'));
        if (creatorId == userId) {
            messageId = element.substr(element.indexOf(':') + 1, element.length - 1);
            liveCreators.splice(index, 1);
        }
    });
    
    if (messageId)
        channel.messages.fetch(messageId).then(msg => msg.delete());
}

function isGameAllowed(guildId, gameId) {
    const allowedGames = db.get(`${guildId}.games`);
    return allowedGames.find(game => game == gameId);
}

function removePostAndRole(channel, guild, user, liveRole = null) {
    removeLiveEmbed(channel, user.id);
    
    if (liveRole)
        guild.member(user).roles.remove(liveRole);
}

module.exports.checkStreams = (client, guildId) => {
    if (!db.get(`${guildId}.isCreatorsSetup`)) return;
    
    const creators = db.get(`${guildId}.creators`);
    if (!creators) return;

    const guild = client.guilds.cache.get(guildId);
    const liveChannel = client.channels.cache.get(db.get(`${guildId}.streamsChannel`));
    const liveRoleId = db.get(`${guildId}.liveRole`);

    let liveRole = null;
    if (liveRoleId)
        liveRole = guild.roles.cache.get(liveRoleId);

    creators.forEach(element => {
        const user = client.users.cache.get(element.substr(0, element.indexOf(':')));
        const twitchId = element.substr(element.indexOf(':') + 1, element.length - 1);
        if (!user || !twitch) return;

        const isCreatorLive = liveCreators.find(creator => creator.substr(0, element.indexOf(':')) == user.id);
        twitch.getStreamData(twitchId).then(function(streamData) {
            if (streamData.data.length !== 0) {
                if (isCreatorLive && isGameAllowed(guild.id, streamData.data[0].game_id)) return;
                else if (isCreatorLive && !isGameAllowed(guild.id, streamData.data[0].game_id)) return removePostAndRole(liveChannel, guild, user, liveRole);
                if (!isGameAllowed(guild.id, streamData.data[0].game_id)) return;
                
                
                sendLiveEmbed(user, liveChannel, streamData.data[0]);
    
                if (liveRoleId)
                    guild.member(user).roles.add(liveRole);
            } else {
                if (!isCreatorLive) return;
    
                removePostAndRole(liveChannel, guild, user, liveRole);
            }
        });
    });
}