exports.run = (client, message, args) => {
    console.log("Authorize "+args[0])
        const low = require('lowdb');
        const FileSync = require('lowdb/adapters/FileSync');
        const adapter = new FileSync('db.json');
        const db = low(adapter);
        var channels = db.get("channels").value()
        var admins = db.get("admins").value()
        if (admins.indexOf(args[0].slice(3,-1))===-1){
            db.get("admins")
            .push(args[0].slice(3,-1))
            .write()
            message.channel.send(args[0]+" can now use commands anywhere.")
        } else {
            message.channel.send("user already has access")
        }
    
}