exports.run = (client, message, args) => {
    try {
        if (message.channel.id === db.get("mainChannel").value()) { return }
        if (args.length !== 1) {
            message.channel.send("Usage: " + config.prefix + "submit <Musescore URL>").then(warn => warn.delete(4000))
            message.delete()
            return
        }
        let fDat = db.get("tournaments").value()
        let data = findObjectByKey(fDat, "channel", message.channel.id)

        if (data === null) {
            data = findObjectByKey(fDat, "judgeChannel", message.channel.id)
        }

        let tindex = index

        let tUsRb = findObjectByKey(data.submissions, "authorid", message.author.id)
        if (tUsRb !== null) {
            message.channel.send("You have already submitted.").then(warn => warn.delete(4000))
            message.delete()
            return
        }

        let tDat = []
        tDat = db.get("tournaments").value()
        tDat[tindex].submissions.push({"author":message.author.username,"authorid":message.author.id,"url":args[0],"submissionDate":new Date()})
        db.set("tournaments".tDat).write()
        message.channel.send("`"+message.author.username+" has submited their score`")
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
