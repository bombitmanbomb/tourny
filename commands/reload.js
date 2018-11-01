exports.run = (client, message, args) => {
    try {
        console.log("RELOAD")
    //message.channel.send("Database Reloaded.")
        reset.get("refresh").value()
        reset.set("refresh",[]).write()
        message.delete()
    }
    catch(err){
        console.log(err)
    }
}
var config = require("../config.json")
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var reset = new FileSync('refresh.json');
var reset = low(reset);

//