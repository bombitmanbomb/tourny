exports.run = (client, message, args) => {
    //message.channel.send("Coming Soon!").catch(console.error);
    var config = require("../config.json");
    var database = require("../db.json");
    var fs = require("fs");
    var embed = {
        embed: {
            color: 534636,
            author: {
                name: client.user.username,
                icon_url: client.user.avatarURL
            },
            title: "Command List",
            fields: [],
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
                text: "Tourny Bot " + config.version + ". by Bomb & Kou"
            }
        }
    };
    if (args.length === 0) {
        fs.readdir('./commands/', function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                var Descriptions = require("../help.json");
                console.log(file);
                var help = Descriptions[file.slice(0, -3)];
                if (String(help) !== "undefined") {
                    embed.embed.fields.push({ name: file.slice(0, -3), value: config.prefix + help.usage, inline: true });
                }
            });
            //console.log(commands)
            message.channel.send(embed);
            return;
        });
    }
    if (args[0] === "admin") {
        if (database.admins.indexOf(message.author.id) !== 0) {
            embed.embed.title = "Admin Commands";
            fs.readdir('../admin-commands/', function (err, files) {
                //handling error
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                }
                files.forEach(function (file) {
                    // Do whatever you want to do with the file
                    var Descriptions = require("../admin-help.json");
                    console.log(file);
                    var help = Descriptions[file.slice(0, -3)];
                    if (String(help) !== "undefined") {
                        embed.embed.fields.push({ name: file.slice(0, -3), value: config.prefix + help.usage, inline: true });
                    }
                });
                //console.log(commands)
                message.channel.send(embed);
                return;
            });
        }
        else {
            message.reply("You are unauthorized to preform this command").then(warn => warn.delete(4000))
            message.delete()
        }
    }
};