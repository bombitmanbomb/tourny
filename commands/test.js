exports.run = (client, message, args) => {
    const config = require("../config.json");
    try {
        var embed = {
            embed: {
                color: 534636,
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL
                },
                description: " ",
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: "Tournament Bot " + config.version + " by Bomb & Kou"
                }
            }
        }
        embed.embed.description = "<@"+message.author.id+">"
        message.channel.send("",embed)
    }
    catch (err) {
        console.log(err)
    }
}