exports.run = (client, message, args) => {
    delete config
    delete tData
    delete tM
    delete tJ
    try {
        var config = require("../config.json");
        var tData
        let tM = db.get('tournaments')
            .find({ channel: message.channel.id })
            .value()
        let tJ = db.get('tournaments')
            .find({ judgeChannel: message.channel.id })
            .value()
        if (tM === undefined && tJ === undefined) {
            return
        }
        if (tM !== undefined) {
            tData = tM
        } else {
            tData = tJ
        }



        embed = {
            "embed": {
                "title": tData.title,
                "description": "Owner: " + tData.ownerUsername + " | Members (" + tData.users.length + "/" + tData.userCountMax + ")+" + tData.judges.length,
                "color": 8754801,
                "timestamp": new Date(),
                "footer": {
                    "icon_url": "http://s.musescore.org/about/images/musescore-mu-whitebg-xl.png",
                    "text": "Musescore Competition Bot " + config.version + " by Bomb & Kou"
                },
                "author": {
                    "name": "Competition Info",
                    "icon_url": "http://s.musescore.org/about/images/musescore-mu-whitebg-xl.png"
                },
                "fields": [
                ]
            }




        }
        ///INFO
            embed.embed.fields.push({
                "name": "MOTD",
                "value": tData.motd,
                "inline": false
            })
            embed.embed.fields.push({
                "name": "RULES",
                "value": tData.rules,
                "inline": false
            })
        ///JUDGES
        var v = ""
        var i = 0;
        for (i = 0; i < tData.judges.length; i++) {
            v = v + tData.judges[i].username + "\n";
        }
        let tJv = db.get("invites").value()
        FtJv = tJv.filter(function (val) {
            //console.log(val.type,val.compid)
            if (val.type==="judge"&&val.compid===tData.id) {return true} else {return false}
        });
        i = 0;
        for (i = 0; i < FtJv.length; i++) {
            v = v + message.guild.members.get(FtJv[i].userid).user.username + "(*pending*)\n";
        }



        embed.embed.fields.push({
            "name": "Judges",
            "value": v,
            "inline": true
        })
        ///PARTICIPANTS
        v = ""
        i = 0
        for (i = 0; i < tData.users.length; i++) {
            v = v + tData.users[i].username + "\n";
        }
        if (tData.users.length === 0) { v = "None\n" }
        let tJw = db.get("invites").value()
        FtJw = tJw.filter(function (val) {
            //console.log(val.type,val.compid)
            if (val.type==="user"&&val.compid===tData.id) {return true} else {return false}
        });
        i = 0;
        for (i = 0; i < FtJw.length; i++) {
            v = v + message.guild.members.get(FtJw[i].userid).user.username + "(*pending*)\n";
        }



        embed.embed.fields.push({
            "name": "Participants",
            "value": v,
            "inline": true
        })
        message.channel.send(embed)
    }
    catch (err) { console.log(err) }
}

var config = require("../config.json")
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);