//DATABASE;
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
var db = low(adapter);
var channels = []
var admins = []
db.defaults({
    "complist": "",
    "mainChannel": "493722553664405515",
    "admins": [
        "174609192340946944",
        "194944794441547776"
    ],
    "info": [],
    "invites": [],
    "tournaments": [],
    "channels": [
        "493722553664405515"
    ]
}).write()





//const axios = require("axios");
//DISCORD
const { Client } = require('discord.js');
const client = new Client({ disableEveryone: true });
const drp = require('discord-rich-presence')('476170201747161088');
const fs = require("fs");
const config = require("./config.json");

//CODE
client.login(config.token);
client.on('ready', () => {
    console.log("Bot is Online!");
    client.user.setPresence({ game: { name: config.prefix + "help | Version " + config.version }, status: 'active' })

    //update invite id 494255891894239233 channel 493722553664405515
    updateInfo()
})

client.on("error", err => {
    console.log(err)
})
client.on('message', message => {
    try {
        db.read()
        var invalidCom = false
        channels = undefined
        admins = undefined
        var adminCom = false
        delete require.cache[require.resolve('./db.json')]
        var database = require("./db.json")
        channels = database.channels
        admins = database.admins



        if (message.author.bot) return;
        let d = new Date()
        console.log(d.toLocaleTimeString(), d.toLocaleDateString(), "|", message.channel.name, "|", message.author.username, ":", message.content)
        if (message.content.indexOf(config.prefix) !== 0) { return } else { client.user.setPresence({ activity: { name: config.prefix + "help  |  Version " + config.version }, status: 'online' }) }

        //console.log(db.get("channels").find({ "channel": message.channel.id}).value() )
        if (message.channel.id === database.mainChannel || channels.indexOf(message.channel.id) !== -1 || admins.indexOf(message.author.id) !== -1 || message.channel.permissionsFor(message.member).has("ADMINISTRATOR", false) === true) {

            if (message.content.startsWith(config.prefix)) {

                const args = message.content.slice(config.prefix.length).trim().split(/ +/g);


                const command = args.shift().toLowerCase();
                if (command.charAt(0) === ".") {
                    message.reply("Nice Try :)").then(warn => warn.delete(4000))
                    message.delete()
                    return
                }


                if (command === "") {
                    message.reply("For a list of commands run " + config.prefix + "help").then(warn => warn.delete(4000))
                    message.delete()
                    // command = "help"
                    return
                }
                try {
                    console.log("!!!!!!!!!!!!!!!!!!!!!" + command + "!!!!!!!!!!!!!!!!!!!!!!!")
                    db.read()
                    let commandFile = require(`./commands/${command}.js`);
                    commandFile.run(client, message, args);
                    return


                } catch (err) {
                    invalidCom = true
                    //console.log(err)
                }
                console.log(message.channel.id, message.content)
            }

        }
        if (admins.indexOf(message.author.id) !== -1) {

            if (message.content.startsWith(config.prefix)) {
                //message.channel.send("command");

                const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
                const command = args.shift().toLowerCase();
                if (command === "") { return }
                try {
                    let commandFile = require(`./admin-commands/${command}.js`);
                    commandFile.run(client, message, args);
                    invalidCom = false
                } catch (err) {
                    //message.channel.send(command + " is not a valid command.")
                    //console.log(err)
                    invalidCom = true
                }



                console.log(message.channel.id, message.content)
            }
        }
        if (invalidCom === true) {
            message.channel.send("Command Invalid").then(warn => warn.delete(4000))
            message.delete()
        }
    } catch (err) {
        client.user.setPresence({ game: { name: "FATAL ERROR" }, status: 'dnd' })
        message.channel.send("<@!174609192340946944> Check my Log. A Fatal error has occured.")
        drp.updatePresence({
            details: 'The Bot has Crashed. Downtime:',
            startTimestamp: Math.round((new Date()).getTime() / 1000),
            largeImageKey: 'snek_large',
            smallImageKey: 'snek_small',
            instance: true,
        });
    }
});
function updateInfo() {
    db.read()
    try {
        client.channels.get("493722553664405515").guild.channels.get("493722553664405515").fetchPinnedMessages().then((dat) => {
            f = dat.get(db.get("complist").value()) //MESSAGE ID
            ///TOURNY LIST
            var tDat = db.get("tournaments").value()

            var embed = {
                embed: {
                    color: 534636,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: "Tournaments (" + tDat.length + ")",
                    description: "====================================",
                    fields: [],
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.avatarURL,
                        text: "Tournament Bot " + config.version + " by Bomb & Kou"
                    }
                }
            }
            for (var i = 0; i < tDat.length; i++) {
                embed.embed.fields.push({ name: tDat[i].title + " (" + tDat[i].users.length + "/" + tDat[i].userCountMax + ")", value: "Host: " + tDat[i].ownerUsername + " | " + tDat[i].privacy.charAt(0).toUpperCase()+tDat[i].privacy.substr(1) + " | Join ID: " + tDat[i].joinID+"\n<#"+tDat[i].channel+">", inline: false })
            }

            f.edit("```php\nType '" + config.prefix + "help' for help. Type '" + config.prefix + "join <joinID>' to join a tournament. Use '" + config.prefix + "host' to create a new tournament. ```\nThe # links below will become clickable when you join a tournament\n`Messages in this channel are only visable for 15 minutes.\nYou may refer to this auto-updating list at any time in the Pins.`", embed) //EDIT TOURNAMENT LIST
        }
        )
        let p = require("./updateinfo.js")
        p.run(client)
    }
    catch (err) { console.log(err) }
}