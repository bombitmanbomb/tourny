exports.run = (client, message, args) => {
    try {
        if (message.channel.id !== db.get("mainChannel").value()) { return; }
        if (args.length < 1) {
            message.channel.send("Usage: `" + config.prefix + "invite` `<user>` `[judge]`")
            
            return;
        }
        var userId = getID(args[0], message)
        if (userId === -1 || userId === undefined) { message.channel.send("Invalid User"); return; }
        let userInfo = message.guild.members.get(userId)
        let fDat = db.get("tournaments").value()
        let data = findObjectByKey(fDat, "ownerId", message.author.id)
        //console.log(data)

        if (message.guild.members.get(message.author.id).roles.get("496908444586999809") !== undefined) {
            message.reply("You are banned from Tournaments. Continued Attempts to use this command will result in a Server Mute.")
            
            return
        }



        if (data === null) {
            message.reply("You are not a Tournament Host.")
            
            return
        }
        if (userId === message.author.id) {
            message.channel.send("Unable to invite Self")
            
            return
        }
        var iType
        if (String(args[1]) === "judge") { iType = "judge" } else { iType = "user" }


        let t = db.get("invites").value()
        let y = findObjectByKey(t, "userid", userId, "compid", data.id, "type", iType)
        if (y !== null) {
            message.channel.send("Invite Already Sent")
            
            return
        } else {
            db.get("invites")
                .push({ "userid": userId, "compid": data.id, "type": iType })
                .write()
        }

        //userId
        message.channel.send("Invite Sent.")
        
        message.guild.members.get(userId).send('You have been invited to ' + data.title + ". to accept type \n`"+config.prefix+"join" + data.id + " " + iType + "` in <#493722553664405515>.")
    }

    catch (err) { console.log(err) }
}
var config = require("../config.json")
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);


function getID(userstring, message) {
    if (userstring.startsWith("<@!")) {
        return userstring.slice(3, -1)
    }
    if (userstring.startsWith("<@")) {
        return userstring.slice(2, -1)
    }
    return -1
}
function findObjectByKey(array, key, value, key2, value2, key3, value3) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            if (key2 === undefined) {
                index = i
                return array[i];
            } else {
                if (array[i][key2] === value2) {
                    if (key3 === undefined) {
                        index = i
                        return array[i];
                    } else {
                        if (array[i][key3] === value3) {
                            index = i
                            return array[i];
                        }
                    }
                }
            }
        }
    }
    return null;
}

function arrayRemove(arr, value) {

    return arr.filter(function (ele) {
        return ele != value;
    });

}

function objectRemove(myObjects, prop, valu, prop2, valu2) {
    return myObjects.filter(function (val) {
        if (val[prop] !== valu || val[prop2] !== valu2) {
            return true
        } else {
            return false
        }
    });

}
