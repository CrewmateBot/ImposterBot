const Discord = require("discord.js")
const db = require("quick.db")
const infoEmbed = new Discord.MessageEmbed()
.setColor('#ff0000')
.setTitle('Hvordan man laver et game')
.setAuthor('Imposter')
.setThumbnail("https://cdn.discordapp.com/avatars/753856611990110228/5571c473ceec5eaf5e49aa6799c61787.png?size=256client.user.avatar")
.addFields(
  {name: "Hvordan man laver et spil", value: "Join 🎮opret-spil", inline: true},
  {name: "\u200b", value: "\u200b"},
  {name: "Info", value: "Kanalerne forsvinder igen når de har været brugt.", inline: true},
  {name: "Info", value: "Når man laver et game vil der automatisk komme en ping besked der forsvinder efter 15 sec", inline: true},
)

module.exports = {
	name: "infomessage",
  description: "Creates an information message about how to create games",
  useExample: "[prefix]infomessage",
  useDesc: "This will create the infomessage in the channel",
  userPermissions: ["ADMINISTRATOR"],
  /**
   * 
   * @param {Discord.Message} message 
   * @param {string[]} args 
   */
	execute(client, message, args) {
        message.delete();
        message.channel.send(infoEmbed).then((message) =>
        {
          if(!db.get(message.guild.id + ".notifyEmojiID"))
          {
            return message.channel.send("No react emoji has been set").then((message) => 
            {
                setTimeout(() => {
                    message.delete();
                }, 3000);
            });;;
          }
          var emoji = message.guild.emojis.cache.find((emoji) => emoji.id == db.get(message.guild.id+ ".notifyEmojiID"));
          if(!emoji)
          {
            return message.reply("React emoji no longer exists or could not be found").then((message) => 
            {
                setTimeout(() => {
                    message.delete();
                }, 3000);
            });;;
          }
          message.react(emoji);
          db.set(message.guild.id + ".gamesChannel", message.channel.id);
        });
        
    }
}
