// Needs reworking into several functions, might be able to do it in 1 but not sure :peepohappy:
const db = require("quick.db")
module.exports.eventHandler = async (client, oldState,newState) => {
    var categoryID = "";
    if(oldState.channel != null && newState.channel != null)
    {
      if(oldState.channel.id === newState.channel.id)
      {
        return;
      }
    }

    if(checkChannel(oldState) == true)
    {
      deleteChannelIfEmpty(oldState)
      updateUserPerms(oldState,false)
    }
    
    
    if(checkChannel(newState) == true)
    {
      updateUserPerms(newState,true)
    }

    if(newState.channel != null)
    {
      if(newState.channel.id == db.get(newState.guild.id+".createGameVoice"))
      {
        createGame(newState);
      }
    }
};

function createGame(context)
{
    if(!db.get(context.guild.id + ".categoryID"))
    {
        return;
    }
    
    if(!context.guild.channels.cache.find((channel) => channel.id == db.get(context.guild.id + ".categoryID")))
    {
        return;
    }

    context.guild.channels.create(getNameOfUser(context.member) + "'s game", {type: "voice",userLimit: "10"}).then((newChannel) =>
    {
        newChannelID = newChannel.id;
        var categoryID = db.get(context.guild.id + ".categoryID");
        newChannel.setParent(categoryID);
        context.guild.channels.create(getNameOfUser(context.member) + "'s game").then((newTextChannel) =>
        {
            
            var categoryID = db.get(context.guild.id + ".categoryID");

            newTextChannel.setParent(categoryID);

            newTextChannel.overwritePermissions([{
                id: context.guild.roles.everyone,
                deny: ['VIEW_CHANNEL']
            }])
            
            db.set(context.guild.id + "." + newChannel.id + ".text", newTextChannel.id);
            db.set(context.guild.id + "." + newTextChannel.id + ".owner", context.member.id);

            setTimeout(() => {
                if (context.member.voice.channel)
                    context.member.voice.setChannel(newChannel);
            }, 500);

        }).catch(console.error());

        setTimeout(checkAndNotify, 10000, context, newChannel);
    });
}

function checkAndNotify(context, voiceChannel)
{
    if (!context.member.voice.channel || context.member.voice.channel != voiceChannel) return;

    try {
        notifyUsersOfGame(context)    
    }
    catch(e)
    {
    console.log("Infomessage likely not set on guild: " + context.guild.name + " | " + context.guild.id + " (Error: " + e + ")")
    }
}

function getNameOfUser(user)
{
    return user.nickname ? user.nickname : user.user.username;
}

function notifyUsersOfGame(context)
{
    var roleID = db.get(context.guild.id+".notifyRoleID");

    if(roleID)
    {
        var notifyMessage = "<@&" + roleID + "> " + "\n" + getNameOfUser(context.member) + " har lige lavet et game.\nKom og vær med!";
        context.guild.channels.cache.find((channel) => channel.id == db.get((context.guild.id + ".gamesChannel"))).send(notifyMessage).then((message) => 
        {
            setTimeout(() => {
                message.delete();
            }, 15000);
        });
    }
}

function updateUserPerms(voiceState, vision)
{
  voiceState.guild.channels.cache.forEach((vars) => 
  {
    if(vars.id == db.get(voiceState.guild.id + "." + voiceState.channelID + ".text"))
    {
        vars.updateOverwrite(voiceState.member, {'VIEW_CHANNEL': vision});
    }
  })
}

function deleteChannelIfEmpty(voiceState)
{ 
  if(voiceState.channel.members.size == 0)
  {
    if (voiceState.channel)
        voiceState.channel.delete();

    voiceState.guild.channels.cache.forEach((vars) => 
    {
        if(vars.id == db.get(voiceState.guild.id + "." + voiceState.channelID + ".text"))
        {
            vars.delete();
        }
    })
  }
}

function checkChannel(voiceState)
{
  if(voiceState.channel == null) return false;

  categoryID = db.get(voiceState.guild.id + ".categoryID") 

  if(voiceState.channel.parent.id == categoryID)
  {
    if(db.get(voiceState.guild.id + "." + voiceState.channelID))
    {
      return true;
    }
  }
  return false
}