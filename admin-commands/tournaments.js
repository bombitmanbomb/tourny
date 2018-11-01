exports.run = (client, message, args) => {
    if (message.channel.id!==db.get("mainChannel").value()) {return}
    if (message.guild.members.get(message.author.id).roles.get("496908444586999809")!== undefined){
        message.reply("You are banned from interacting with the tournaments bot.").then( warn => warn.delete(4000))
        message.delete()
    return
    }
    var tDat = db.get("tournaments").value()

    var embed = {
        embed: {
            color: 534636,
            author: {
                name: client.user.username,
                icon_url: client.user.avatarURL
            },
            title: "Tournaments ("+tDat.length+")",
            description:"==========",
            fields: [],
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
                text: "Musescore Tournament Bot " + config.version + ". by Bomb & Kou"
            }
        }
    }
    for (var i = 0; i < tDat.length; i++) {
        embed.embed.fields.push({ name:tDat[i].title+" ("+tDat[i].users.length+"/"+tDat[i].userCountMax+")" , value: "Host: "+tDat[i].ownerUsername+" | "+tDat[i].privacy+" | Join ID: "+tDat[i].joinID, inline:false })
    }
    message.channel.send(embed)




    
}
var config = require("../config.json")
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);

 