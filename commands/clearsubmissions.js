exports.run = (client, message, args) => {
    try {
        let mainChannel =  db.get("mainChannel").value()
        if (message.channel.id === mainChannel) { return }

        let data = db.get('tournaments')
            .find({ "channel": message.channel.id })
            .value()
        if (data === undefined) {
            data = db.get('tournaments')
                .find({ "judgeChannel": message.channel.id })
                .value()
        }
        if (message.author.id !== data.ownerId) { message.channel.send("You are not the host of this competition"); return; }


        if (args.length === 0) {
            message.channel.send("This will delete all submissions. To confirm type `" + config.prefix + "clearsubmissions confirm`")
            return;
        }
        if (args[0] !== "confirm") {
            message.channel.send("Please Confirm")
            return
        }


let tDat =  db.get("tournaments").value()

        findObjectByKey(tDat, "joinID", Number(data.id))
        tDat[index].submissions = []
        db.set("tournaments".tDat).write()
        message.channel.send("Submissions Cleared")













        reset.set("refresh",[]).write()
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


var reset = new FileSync('refresh.json');
var reset = low(reset);