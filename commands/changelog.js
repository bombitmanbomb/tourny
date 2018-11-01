exports.run = (client, message, args) => {
    try {
        var config = require("../config.json");

        var fs = require("fs");
        var embed = {
            embed: {
                color: 534636,
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL
                },
                title: "Changelog - Current Version " + config.version,
                fields: [],
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: "Musescore Tournament Bot " + config.version + ". by Bomb & Kou"
                }
            }
        }
        var log = {}
        log = require("../change-log.json")
        log.changelog.reverse()
        let o = []
        var i;
        var limit = log.changelog.length
        if (limit > 6){limit = 6}
        for (i = 0; i < limit; i++) {
            embed.embed.fields.push({ name: log.changelog[i].version, value: log.changelog[i].description})
        }

       
        message.channel.send(embed);
    }
    catch (err) {
        console.log(err)
    }
}