exports.run = (client, message, args) => {
    const low = require('lowdb');
    const FileSync = require('lowdb/adapters/FileSync');
    const adapter = new FileSync('db.json');
    const db = low(adapter);
    var channels = db.get("channels").value()
    newChannels = []
    var admins = db.get("admins").value()
    if (admins.indexOf(args[0].slice(3,-1)) === -1) {
        message.channel.send("User is not authorized")
    } else {
        var i;
        for (i = 0; i < channels.length; i++) {
            if (admins[i]!==args[0].slice(3,-1)){
                newChannels[newChannels.length] = admins[i]
            }
        }
        db.set("admins",newChannels).write()
        //console.log(newChannels)
        message.channel.send("User no longer is authorized")
    }
}