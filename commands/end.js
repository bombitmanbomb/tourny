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
        if (message.author.id !== data.ownerId) { message.channel.send("You are not the owner of this competition"); return; }


        if (args.length === 0) {
            message.channel.send("Are you sure you with to End this competition? All channels will be deleted. to confirm type ")
            message.channel.send("`"+config.prefix + "end " + data.ownerId + "`")
            return;
        }
        if (args[0] !== data.ownerId) {
            message.channel.send("Invalid Confirmation ID")
            return
        }
        tDat = db.get('channels')
            .value()
        tDat = arrayRemove(arrayRemove(tDat, data.channel), data.judgeChannel)
        db.set("channels", tDat).write()
        tDat = db.get("tournaments").value()
        tDat = objectRemove(tDat, "joinID", data.id)
        db.set("tournaments", tDat).write()
        
                tDat = db.get("info").value()
                tDat = objectRemove(tDat,"compid",data.id)
                db.set("info",tDat).write()
        
        tDat = db.get("invites").value()
        tDat = objectRemove(tDat, "compid", data.id)
        db.set("invites", tDat).write()
        message.guild.channels.get(mainChannel).send(data.title + " has Ended. Winner: " + data.winner)
        message.guild.channels.get(data.channel).delete()
        message.guild.channels.get(data.judgeChannel).delete()
        message.guild.roles.get(data.role).delete()
        message.guild.roles.get(data.judgeRole).delete()
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