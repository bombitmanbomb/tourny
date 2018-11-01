exports.run = (client, message, args) => {
    try {
        if (message.channel.id === db.get("mainChannel").value()) { return }
        if (args.length !== 1) {
            message.channel.send("Usage: " + config.prefix + "transferownership <user>").then(warn => warn.delete(4000))
            message.delete()
            return
        }
        let fDat = db.get("tournaments").value()
        let data = findObjectByKey(fDat, "channel", message.channel.id)

        if (data === null) {
            data = findObjectByKey(fDat, "judgeChannel", message.channel.id)
        }
        const pIndex = index
        let tDat = []
        tDat = db.get("tournaments").value()
        if (data.ownerId!==message.author.id){
            message.reply("Only the host may run this command").then(warn => warn.delete(4000))
            message.delete()
            return
        }
        var userId = getID(args[0], message)
        if (userId===-1) {
            message.channel.reply("Invalid User").then(warn => warn.delete(4000))
            message.delete()
            return
        }
        var user = message.guild.members.get(userId).member

        console.log(message.guild.members.get(userId))
        return
        



        tDat[index].ownerId = userId
        tDat[index].ownerUsername = user.tag
        user.addRole(data.judgeRole)
        user.removeRole(data.role)
        tDat[index].users = objectRemove(tDat[index].users,"id",message.author.id)
        tDat[index].users = objectRemove(tDat[index].judges,"id",message.author.id)
        tDat[index].judges.push({
            "id": userId,
            "username": user.username
          })











        db.set("tournaments".tDat).write()
        message.reply("Owner Set").then(warn => warn.delete(4000))
        message.delete()
        return
    }
    catch (err) {
        console.log(err)
    }


}
var config = require("../config.json")
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);
var index = 0

function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            index = i
            return array[i];
        }
    }
    return null;
}
function objectRemove(myObjects, prop, valu) {
    return myObjects.filter(function (val) {
        return val[prop] !== valu;
    });

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