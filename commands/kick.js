exports.run = (client, message, args) => {
    try {
        let mainChannel = db.get("mainChannel").value()
        if (message.channel.id === mainChannel) { return }

        let data = db.get('tournaments')
            .find({ "channel": message.channel.id })
            .value()
        if (data === undefined) {
            data = db.get('tournaments')
                .find({ "judgeChannel": message.channel.id })
                .value()
        }
        if (data.ownerId !== message.author.id) {
            message.reply("Only the host may run this command").then(warn => warn.delete(4000))
            message.delete()
            return
        }
        if (args.length !== 1) {
            message.channel.send("Usage: `" + config.prefix + "kick` `<user>` `[Reason]`").then(warn => warn.delete(4000))
            message.delete()
            return
        }
        userId = getID(args[0], message)
        let tDat = []
        tDat = db.get("tournaments").value()
        findObjectByKey(tDat, "joinID", Number(data.id))
        if (tDat[index].ownerId === userId) {
            message.reply("You can not kick yourself.");
            return
        }
        message.guild.members.get(userId).removeRole(data.role)
        message.guild.members.get(userId).removeRole(data.judgeRole)
        tDat[index].users = objectRemove(tDat[index].users, "id", userId)
        tDat[index].judges = objectRemove(tDat[index].users, "id", userId)
        db.set("tournaments".tDat).write()
        //console.log(message.guild.members.get(userId))
        message.guild.channels.get(data.channel).send("`" + message.guild.members.get(userId).user.username + " has been kicked.`")
        message.guild.members.get(userId).send("You have been kicked from "+tDat[index].title)
        var Lembed = {
            embed: {
                color: 534636,
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL
                },
                description: " ",
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: "Tournament Bot " + config.version + " by Bomb & Kou"
                }
            }
        }
        Lembed.embed.description = "<@"+userId+"> **was kicked from** <#"+tDat[index].channel+">"
        message.guild.channels.get(config.log).send("",Lembed)
        
        
        
        
        
        message.delete()
        args.shift()
        
        user.send("You have been kicked from "+data.title+" ("+args.join(" ")+")")
        console.log("REFRESH!!!!!!!!")
        reset.set("refresh", []).write()
    }
    catch (err) { console.log(err) }
}
var _ = require('lodash');
var config = require("../config.json")
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);
var index = 0
//

function arrayRemove(arr, value) {

    return arr.filter(function (ele) {
        return ele != value;
    });

}

function objectRemove(myObjects, prop, valu) {
    return myObjects.filter(function (val) {
        return val[prop] !== valu;
    });

}
function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            index = i
            return array[i];
        }
    }
    return null;
}

function getID(userstring, message) {
    if (userstring.startsWith("<@!")) {
        return userstring.slice(3, -1)
    }
    if (userstring.startsWith("<@")) {
        return userstring.slice(2, -1)
    }
    return -1
}

var reset = new FileSync('refresh.json');
var reset = low(reset);