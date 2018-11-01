exports.run = (client) => {
    client.user.setPresence({ game: {  name: config.prefix + "help | Version " + config.version +" (Updating)"}, status: 'active' })
    try {
    update(0,client)
    } catch (err) {console.log}
}

var infolist
var tournaments
var config = require("./config.json")
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('./db.json');
var db = low(adapter);

function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}



function update(x,client){
        infolist = db.get("info").value()
        tournaments = db.get("tournaments").value()
        var guild = client.guilds.get("257591778012561410")

        if (x < infolist.length) {
            let tournamentinfo = findObjectByKey(tournaments, "id", infolist[x].compid)
            //console.log(tournamentinfo)
            let channel = guild.channels.get(tournamentinfo.channel)
            var mID = infolist[x].infoID
            channel.fetchPinnedMessages().then((pins) => {
                let toupdate = pins.get(mID)
                if (toupdate !== undefined) {
                    embed = {
                        "embed": {
                            "title": tournamentinfo.title,
                            "description": "Owner: " + tournamentinfo.ownerUsername + " | Members (" + tournamentinfo.users.length + "/" + tournamentinfo.userCountMax + ")+" + tournamentinfo.judges.length,
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
                        "value": tournamentinfo.motd,
                        "inline": false
                    })
                    embed.embed.fields.push({
                        "name": "RULES",
                        "value": tournamentinfo.rules,
                        "inline": false
                    })
                    ///JUDGES
                    var v = ""
                    var i = 0;
                    for (i = 0; i < tournamentinfo.judges.length; i++) {
                        v = v + tournamentinfo.judges[i].username + "\n";
                    }
                    let tJv = db.get("invites").value()
                    FtJv = tJv.filter(function (val) {
                        //console.log(val.type,val.compid)
                        if (val.type === "judge" && val.compid === tournamentinfo.id) { return true } else { return false }
                    });
                    i = 0;
                    for (i = 0; i < FtJv.length; i++) {
                        v = v + guild.members.get(FtJv[i].userid).user.username + "(*pending*)\n";
                    }
                    embed.embed.fields.push({
                        "name": "Judges",
                        "value": v,
                        "inline": true
                    })
                    ///PARTICIPANTS
                    v = ""
                    i = 0
                    for (i = 0; i < tournamentinfo.users.length; i++) {
                        v = v + tournamentinfo.users[i].username + "\n";
                    }
                    if (tournamentinfo.users.length === 0) { v = "None\n" }
                    let tJw = db.get("invites").value()
                    FtJw = tJw.filter(function (val) {
                        //console.log(val.type,val.compid)
                        if (val.type === "user" && val.compid === tournamentinfo.id) { return true } else { return false }
                    });
                    i = 0;
                    for (i = 0; i < FtJw.length; i++) {
                        v = v + guild.members.get(FtJw[i].userid).user.username + "(*pending*)\n";
                    }
                    embed.embed.fields.push({
                        "name": "Participants",
                        "value": v,
                        "inline": true
                    })
                    toupdate.edit("Quick Links:\n<#493722553664405515>\n<#"+tournamentinfo.judgeChannel+">", embed)
                    //console.log("update comp "+x)
                    update(x+1,client)
                }
            })
        }
        client.user.setPresence({ game: {  name: config.prefix + "help | Version " + config.version }, status: 'active' })
}