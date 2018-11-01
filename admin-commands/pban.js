exports.run = (client, message, args) => {
    try {
        if (args.length !== 1) {
            message.channel.send("Usage: " + config.prefix + "pban <user> [Message]")
            return
        }
        userId = getID(args[0], message)
        message.guild.members.get(userId).addRole(message.guild.roles.get("496908444586999809"))
        message.channel.send("`"+message.guild.members.get(userId).user.username+" was banned from Participating, Hosting, and Interacting with the tournament bot.`")
        message.delete()
    }
    catch (err) { console.log(err) }
}
var _ = require('lodash');
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

var reset = new FileSync('refresh.json');
var reset = low(reset);