exports.run = (client, message, args) => {
    //message.channel.send("Coming Soon!").catch(console.error);
    var low = require('lowdb');
    var FileSync = require('lowdb/adapters/FileSync');
    var adapter = new FileSync('db.json');
    var db = low(adapter);
    var Catagories = [
        {
            "catagory": "general",
            "name": "General Commands",
            "info": "These commands can only be run in <#493722553664405515>"
        },
        {
            "catagory": "tournament",
            "name": "Tournament Commands",
            "info": "These commands can only be run in tournament lobbies"
        },
        {
            "catagory": "host",
            "name": "Host Commands",
            "info": "Host Only Commands, Usually for Setup. Can only be run in a Tournament Lobby or Judge Channel."
        }
    ]

    var config = require("../config.json");
    var admins = db.get("admins").value()
    //console.log(database)
    var fs = require("fs");
    var embed = {
        embed: {
            color: 534636,
            author: {
                name: client.user.username,
                icon_url: client.user.avatarURL
            },
            title: "Command List",
            description: "Run help followed by command name for syntax",
            fields: [],
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
                text: "Musescore Tournament Bot " + config.version + ". by Bomb & Kou"
            }
        }
    }
    if (args.length === 0) {
        fs.readdir('./commands/', function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            for (var i = 0; i < Catagories.length; i++) {
                embed.embed.fields.push({ name: "===========================================================", value: ".", inline: false })
                embed.embed.fields.push({ name: "*"+Catagories[i].name+"*", value: Catagories[i].info, inline: false })
                //embed.embed.fields.push({ name: "---------------------------------------------------------------------------------------------------", value: ".", inline: false })
                files.forEach(function (file) {
                    // Do whatever you want to do with the file
                    var Descriptions = require("../help.json")
                    //console.log(file)
                    var help = Descriptions[file.slice(0, -3)];
                    if (String(help) !== "undefined") {
                        if (Catagories[i].catagory===help.s) {
                            embed.embed.fields.push({ name: file.slice(0, -3), value: help.description, inline: true }) //+"\n"+config.prefix + help.usage
                        }
                    }
                });
            }
            //console.log(commands)


            message.author.send(embed);
            try {
                message.delete()
            } catch (err) {console.log(err)}
            return
        });
    }
    if (args[0] === "admin") {
        if (admins.indexOf(message.author.id) !== 0 || message.channel.permissionsFor(message.member).has("ADMINISTRATOR", false) === true) {
            embed.embed.title = "Admin Commands"
            fs.readdir('./admin-commands/', function (err, files) {
                //handling error
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                }
                files.forEach(function (file) {
                    // Do whatever you want to do with the file
                    var Descriptions = require("../admin-help.json")
                    console.log(file)
                    var help = Descriptions[file.slice(0, -3)];
                    if (String(help) !== "undefined") {
                        embed.embed.fields.push({ name: file.slice(0, -3), value: help.description + "\n" + config.prefix + help.usage, inline: true })
                    }
                });
                //console.log(commands)


                message.channel.send(embed);
                return
            });
        } else {
            message.reply("You are unauthorized to preform this command")
        }
    }
}