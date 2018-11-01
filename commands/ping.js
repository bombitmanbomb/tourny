exports.run = (client, message, args) => {
    //let t = new Date().getTime()
    //message.createdTimestamp
    message.channel.send("Pong").then(warn => warn.delete(4000))
            message.delete()
}
