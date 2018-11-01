exports.run = (client, message, args) => {
    return new Promise(resolve => {

        //message.channel.send("Coming Soon!").catch(console.error);
        const config = require("../config.json");

        if (args.length === 0) {
            message.author.send("Usage: " + config.prefix + "help <command>");
            message.delete()
            try {
                let commandFile = require(`./commands.js`);
                commandFile.run(client, message, args);
            } catch (err) {
                message.channel.send("Invalid command.")
                console.log(err)
            }

            return
        }
        const fs = require("fs");
        var embed = {
            embed: {
                color: 534636,
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL
                },
                title: "Help",
                fields: [],
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: "Musescore Tournament Bot " + config.version + ". by Bomb & Kou"
                }
            }
        }



        fs.readdir('./commands/', function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            var commands = []
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                commands.push(file.slice(0, -3))
            });
            //console.log(commands)
            const Descriptions = require("../help.json")
            const help = Descriptions[args[0]];
            embed.embed.title = args[0]
            if (help === undefined) { message.channel.send("No help available for the given command."); return }
            embed.embed.fields.push({ name: help.description, value: config.prefix + help.usage })
            message.channel.send(embed);
            resolve("done")
        });
    })

}