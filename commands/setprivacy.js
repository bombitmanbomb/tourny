exports.run = (client, message, args) => {
    try {
        if (message.channel.id === db.get("mainChannel").value()) { return }
        if (args.length !== 1) {
            message.channel.send("Usage: " + config.prefix + "privacy <public/private>").then(warn => warn.delete(4000))
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
        if (data.ownerId!==message.author.id){
            message.reply("Only the host may run this command").then(warn => warn.delete(4000))
            message.delete()
            return
        }
        let Privacy
        if (args[0].toLowerCase() === "public") {
            Privacy = "public"
        } else if (args[0].toLowerCase() === "private") {
            Privacy = "private"
        } else {
            message.channel.send("Privacy Invalid. Must be public/private").then(warn => warn.delete(4000))
            message.delete()
            return
        }



        tDat[index].privacy= Privacy
        db.set("tournaments".tDat).write()
        message.reply("Privacy Set").then(warn => warn.delete(4000))
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
