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
        let tDat = []
        tDat = db.get("tournaments").value()
        findObjectByKey(tDat, "joinID", Number(data.id))
        if (tDat[index].ownerId===message.author.id){message.reply("You can not leave your own competition").then(warn => warn.delete(4000))
        message.delete()
        ;return}

        tDat[index].users = objectRemove(tDat[index].users,"id",message.author.id)
        db.set("tournaments".tDat).write()
        message.guild.channels.get(data.channel).send("`"+message.author.username+" has left.`")
        message.member.removeRole(data.role)
        message.member.removeRole(data.judgeRole)
        console.log("REFRESH!!!!!!!!")
        message.delete()
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


var reset = new FileSync('refresh.json');
var reset = low(reset);