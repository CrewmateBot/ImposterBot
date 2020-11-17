const db = require("quick.db")
module.exports.eventHandler = async (client, reaction, user) => {
  if(reaction.partial)
  {
    try {
      reaction.fetch();
    }
    catch (error) {
      console.log(error);
      return;
    }
  }
  if(reaction.message.channel.id == db.get(reaction.message.guild.id + ".gamesChannel") )
  {
    if(reaction.emoji.id == db.get(reaction.message.guild.id + ".notifyEmojiID"))
      {
        reaction.message.guild.member(user).roles.remove(reaction.message.guild.roles.cache.find((role) => role.id == db.get(reaction.message.guild.id + ".notifyRoleID")));
      }
  }
};