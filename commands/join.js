exports.run = (client, message, args) => {
var invite = false
if (message.guild===null) {message.channel.send("You must run this command in <#493722553664405515>");return}    
if (message.channel.id !== db.get("mainChannel").value()) { return }
if (message.guild.members.get(message.author.id).roles.get("496908444586999809")!== undefined){
    message.reply("You are banned from participating in tournaments.")

    return
}

    if (args.length < 1) {
        message.channel.send("Usage: `" + config.prefix + "join` `<Tournament ID>` `[\"judge\"]`")
        
        return
    }
    let fDat = db.get("tournaments").value()
    var data = findObjectByKey(fDat, "joinID", Number(args[0]))
    let tInvites = db.get("invites").value()
    if (tInvites!== undefined){
        let invites
   // var invites = findObjectByKey(tInvites, "userid", message.author.id,"compid",Number(args[0]))
    } else {invites = []}
    
    if (data === null||data===undefined) {
        message.channel.send("Invalid ID")
        return
    }
    
    if (String(args[1])!=="judge") {
    try {
        let tDat = []
        tDat = db.get("tournaments").value()

        if (tDat===undefined) {message.channel.send("There are no active tournaments. Start your own with t.host")
        
        return}

        addData = {
            "id": message.author.id,
            "username": message.author.username
        }
        if (data.ownerId === message.author.id) {
            message.channel.send("You can not join your own tournament as a participant. Your tournament is at <#" + data.channel + ">")
            
            return
        }
        if (data.users.length >= Number(data.userCountMax) && data.userCountMax !== "0") {
            message.channel.send("This competition is Full")
            
            return
        }
        let tUsRb = findObjectByKey(data.users, "id", message.author.id)
        if (tUsRb !== null) {
            message.channel.send("You are already a member of this Tournament (<#" + data.channel + ">)")
            return
        }
        if (findObjectByKey(tInvites, "userid", message.author.id,"compid", Number(args[0]),"type","user")!== null)
        {

            invites = objectRemove(tInvites, "userid", message.author.id,"compid", Number(args[0]),"type","user" )
            db.set("invites",invites).write()
        } else if (data.privacy === "private") {
            message.channel.send("This competition is Private")
            
            return
        }


        findObjectByKey(tDat,"id",Number(args[0]))
        tDat[index].users.push(addData)
        db.set("tournaments".tDat).write()
        message.reply("You have joined <#" + data.channel + ">")
        message.guild.channels.get(data.channel).send("`" + message.author.username + " has Joined.`")
        message.member.addRole(data.role)
    }
    catch (err) {
        console.log(err)
    }
    return
} else { ///////                        JUDGE                         ////////
    try {
        index = 0
        let tDat = []
        tDat = db.get("tournaments").value()
        addData = {
            "id": message.author.id,
            "username": message.author.username
        }
        if (data.ownerId===message.author.id){
            message.channel.send("You are the Host. <#"+data.channel+">")
            return
        }
        let tUsRb = findObjectByKey(data.judges, "compid", message.author.id,"type","judge")
        if (tUsRb!==null){
            message.channel.send("You are already a judge for this tournament (<#"+data.judgeChannel+">)")
            return
        }
        tIndex = index

        let lDat = []
        lDat = db.get("invites").value()
        if (lDat === undefined){
            message.channel.send("You have no pending Judge invites")
            return
        }
        if (tInvites===null){
            message.channel.send("You have no pending Judge invites")
            return
        } else {
            invites = []
            invites = objectRemove(tInvites, "userid", message.author.id,"compid", Number(args[0]),"type","judge" )
            db.set("invites",invites).write()
        }
        findObjectByKey(tDat,"id",Number(args[0]))
        fDat[index].judges.push(addData)
        db.set("tournaments".tDat).write()
        message.channel.send("You have joined <#"+data.channel+"> as a Judge")
        message.guild.channels.get(data.channel).send("`" + message.author.username + " is now a judge.`")
        message.member.addRole(data.judgeRole)
        reset.set("refresh",[]).write()
    }
    catch (err) {
        console.log(err)
    }

}


}
var config = require("../config.json")
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);
var index = 0

function findObjectByKey(array, key, value, key2, value2, key3, value3) {
    console.log("findObjectByKey","--------------",array,key+":"+value,key2+":"+value2,key3+":"+value3)
    for (var i = 0; i < array.length; i++) {
        console.log
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

function objectRemove(myObjects, prop, valu, prop2, valu2,prop3,valu3) {
    return myObjects.filter(function (val) {
        if (val[prop] !== valu || val[prop2] !== valu2|| val[prop3] !== valu3) {
            return true
        } else {
            return false
        }
    });

}


var reset = new FileSync('refresh.json');
var reset = low(reset);