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
        let tUsRb = findObjectByKey(tData.judges, "id", message.author.id)
        if (tUsRb === null) {
            message.channel.send("This command is only for judges in the Judge channel").then(warn => warn.delete(4000))
            message.delete()
            return
        }



        embed = {
            "embed": {
                "title": tData.title+" Submissions",
                "description": "Submissions: (" + tData.submissions.length + "/" + tData.userCountMax + ")",
                "color": 8754801,
                "timestamp": new Date(),
                "footer": {
                    "icon_url": "http://s.musescore.org/about/images/musescore-mu-whitebg-xl.png",
                    "text": "Musescore Competition Bot " + config.version + " by Bomb & Kou"
                },
                "author": {
                    "name": "Tourny",
                    "icon_url": "http://s.musescore.org/about/images/musescore-mu-whitebg-xl.png"
                },
                "fields": [
                ]
            }




        }
        ///submissions
        var v = ""
        var i = 0;
        
        for (i = 0; i < tData.submissions.length; i++) {
            embed.embed.fields.push({
                "name": tData.submissions[i].url,
                "value": "Submitted by "+ tData.submissions[i].author+" "+formatDaysAgo(new Date(tData.submissions[i].submissionDate)),
                "inline": false
            })
        }
            
        message.channel.send(embed)
    }
    catch (err) { console.log(err) }
}

var config = require("../config.json")
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);
function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            index = i
            return array[i];
        }
    }
    return null;
}

function formatDaysAgo(date) {
	var ago = new Date().getTime() - date.getTime();
	if (ago < 44 * 1000)
		return "a few seconds ago";
	else if (ago < 89 * 1000)
		return "a minute ago";
	else if (ago < 44 * 60 * 1000)
		return Math.round(ago / 60 / 1000) + ' minutes ago';
	else if (ago < 89 * 60 * 1000)
		return "an hour ago";
	else if (ago < 21 * 60 * 60 * 1000)
		return Math.round(ago / 60 / 60 / 1000) + ' hours ago';
	else if (ago < 35 * 60 * 60 * 1000)
		return "a day ago";
	else if (ago < 25 * 24 * 60 * 60 * 1000)
		return Math.round(ago / 24 / 60 / 60 / 1000) + ' days ago';
	else if (ago < 45 * 24 * 60 * 60 * 1000)
		return 'a month ago';
	else if (ago < 319 * 24 * 60 * 60 * 1000)
		return Math.round(ago / 29 / 24 / 60 / 60 / 1000) + ' months ago';
	else if (ago < 547 * 24 * 60 * 60 * 1000)
		return 'a year ago';
	else
		return Math.round(ago / 365 / 24 / 60 / 60 / 1000) + ' years ago';
}