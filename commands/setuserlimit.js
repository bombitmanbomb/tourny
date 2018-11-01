exports.run = (client, message, args) => {
    try {
        if (message.channel.id === db.get("mainChannel").value()) { return }
        if (args.length !== 1) {
            message.channel.send("Usage: " + config.prefix + "setuserlimit <#> (0 for Infinite)").then(warn => warn.delete(4000))
            message.delete()
            return
        }

        if (isNaN(args[0]) === true) {
            message.channel.send("Usage: " + config.prefix + "setuserlimit <#> (0 for Infinite)").then(warn => warn.delete(4000))
            message.delete()
            return
        }

        let fDat = db.get("tournaments").value()
        let data = findObjectByKey(fDat, "channel", message.channel.id)

        if (data === null) {
            data = findObjectByKey(fDat, "judgeChannel", message.channel.id)
        }
        let tDat = []
        tDat = db.get("tournaments").value()
        if (data.ownerId !== message.author.id) {
            message.reply("Only the host may run this command").then(warn => warn.delete(4000))
            message.delete()
            return
        }





        tDat[index].userCountMax = Number(args[0])
        db.set("tournaments".tDat).write()
        message.reply("Userlimit Set").then(warn => warn.delete(4000))
        message.delete()
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
