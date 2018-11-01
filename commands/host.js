exports.run = (client, message, args) => {
    //does the user already have a comp?
    try {
        if (message.channel.id !== db.get("mainChannel").value()) { return }
        let ex = db.get('tournaments')
            .find({ ownerId: message.author.id })
            .value()
        if (ex !== undefined) {
            if (ex.active === true) {
                message.reply("You can not host more than 1 competition at a time")
                
                return
            }
        }
        if (message.guild.members.get(message.author.id).roles.get("496908444586999809")!== undefined){
            message.reply("You are banned from hosting tournaments.")
            
        return
        }
        ////DEFINITION
        var server = message.guild
        var host = {}
        var comp = {}
        comp.privacy = "public"
        comp.motd = "Set me with "+config.prefix+"setmotd <message> (Discord Formatting is Supported.)"
        comp.rules = "Set me with "+config.prefix+"setrules <message> (use \"\\n\" for new line. Discord Formatting is Supported.)"
        comp.userCountMax = 0
        comp.title = "undefined"
        comp.ownerId = message.author.id
        comp.ownerUsername = message.author.tag
        comp.infinite = false
        comp.users = []
        comp.judges = []
        comp.submissions = []
        comp.channel = undefined
        comp.judgesChannel = undefined
        //PRIVACY
        if (args.length < 3) {
            message.channel.send("Usage: `" + config.prefix + "host` `<public/private>` `<Max # of users (0 for infinite)>` `<Name of Competition>`")
            return
        }
        if (args[0].toLowerCase() === "public") {
            comp.privacy = "public"
        } else if (args[0].toLowerCase() === "private") {
            comp.privacy = "private"
        } else {
            message.channel.send("Privacy Invalid. Must be public/private")
            return
        }
        //USERCOUNT
        if (isNaN(args[1]) === false) {
            if (args[1] === "0") {
                comp.infinite = true
            }
            comp.userCountMax = args[1]
        } else {
            message.channel.send("Usercount Invalid. Expected Number")
            return
        }
        //NAME
        comp.title = args.myJoin(" ", 2)
        let channelName = args.myJoin("-", 2)
        channel = "comp-" + channelName.toLowerCase()
        //JOIN TOURNAMENT AS JUDGE
        host.id = message.author.id
        host.username = message.author.username
        comp.judges.push(host)
        //CREATE CHANNEL
        message.guild.createChannel(channel, 'text', [{
            id: "427542268401025044",
            deny: ['SEND_MESSAGES', 'VIEW_CHANNEL']
        }]).then((channel) => {

            channel.setParent("360581385301393410")
            comp.channel = channel.id
            //CREATE ROLE
            message.guild.createRole("comp-" + channelName, {
                data: {
                    name: channel,
                    hoist: false,
                    mentionable: true,
                    permissions: 0
                },
            }).then((role) => {
                role.setName("comp-" + channelName.toLowerCase())
                comp.role = role.id
                channel.overwritePermissions(message.guild.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false }).then(
                    channel.overwritePermissions(role.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true })).catch(console.log)
                message.member.addRole(role.id)

                message.guild.createChannel("judge-" + channelName, 'text', [{
                    id: "427542268401025044",
                    deny: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                }]).then((channel2) => {

                    channel2.setParent("493610904290721814")
                    comp.judgeChannel = channel2.id
                    //CREATE ROLE
                    message.guild.createRole("judge-" + channelName, {
                        data: {
                            name: channel2,
                            hoist: false,
                            mentionable: true,
                            permissions: 0
                        },
                    }).then((role2) => {
                        role2.setName("judge-" + channelName.toLowerCase())
                        comp.judgeRole = role2.id
                        channel2.overwritePermissions(message.guild.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false }).then(
                        channel2.overwritePermissions(role2.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true, MANAGE_MESSAGES:true }))
                        channel.overwritePermissions(role2.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true, MANAGE_MESSAGES:true })
                        message.member.addRole(role2.id)
                        //message.member.addRole(role.id)
                        //channel.send("Host: <@" + comp.ownerId + ">\nWelcome to the `" + comp.title + "` General Chat Area. Check the Judge Area for Further Setup. You have been granted MANAGE_MESSAGE Permissions in this channel and can delete and Pin messages at any time.")
                        channel2.send("Quick Links:\n<#493722553664405515>\n<#"+comp.channel+">")
                        channel2.send("<@" + comp.ownerId + ">\nWelcome to the `" + comp.title + "` Judges Area. To add more judges use "+ config.prefix +"invite <user> judge. Use "+config.prefix+"info for Further Setup Instructions. When Finished, We reccomend you run "+config.prefix+"info in your competition chatroom.\nYour contestants can submit scores with "+config.prefix+"submit <URL>. these can be viewed by judges at anytime in this channel with "+config.prefix+"submissions.\nTo clear submissions for say, another round use "+config.prefix+"clearsubmissions")
                        channel.send("================================================\nDO NOT DELETE THIS MESSAGE, This will become the Info Screen\n================================================").then((msg) => {msg.pin();db.get("info").push({"infoID":msg.id,"compid":comp.id}).write()})
                        channel.send("Host: <@" + comp.ownerId + ">\nWelcome to the `" + comp.title + "` General Chat Area. Check the Judge Area for Further Setup. You have been granted MANAGE_MESSAGE Permissions in this channel and can delete and Pin messages at any time. This message you can delete.")
                        
                        let tID = firstMissingPositive(db.get("tournaments").value())
                        comp.id = tID
                        comp.joinID = comp.id
                        db.get('channels').push(channel.id).write()
                        db.get('channels').push(channel2.id).write()
                        comp.winner = "Undecided"
                        comp.active = true

                        db.get("tournaments").push(comp).write() //SAVE TO DB
                        reset.set("refresh",[]).write()
                        if (comp.privacy === "public"){
                       message.channel.send("<@&499470582409068546>\n"+message.author.username + " has created a " + comp.privacy + " competition. | " + comp.title + "\nJoin with " + config.prefix + "join " + comp.id+"\n<#"+comp.channel+">")
                        console.log("REFRESH!!!!!!!!!")
                            message.delete()
                    } else {
                            message.channel.send(message.author.username + " has created a " + comp.privacy + " competition. | " + comp.title +"\nInvite members with " + config.prefix + "invite <user>"+"\n<#"+comp.channel+">")
                       message.delete()
                        }
                    })
                })
            })
        })
    }
    catch (err) {
        console.log(err)
    }
    //DONE
}
delete db
delete low
delete FileSync
delete adapter
var config = require("../config.json")
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);

var reset = new FileSync('refresh.json');
var reset = low(reset);

Array.prototype.myJoin = function (seperator, start, end) {
    if (!start) start = 0;
    if (!end) end = this.length - 1;
    end++;
    return this.slice(start, end).join(seperator);
};
var firstMissingPositive = function(tourn) {
    let nums = []
    for (let i = 0; i<tourn.length; i++) {
        nums.push(tourn[i].id)
    }



    var swap = function(i, j) {
        var tmp = nums[i];
        nums[i] = nums[j];
        nums[j] = tmp;
    };

    for (let i = 0; i < nums.length; i++) {
        while (0 < nums[i] && nums[i] - 1 < nums.length
                && nums[i] != i + 1
                && nums[i] != nums[nums[i] - 1]) {
            swap(i, nums[i] - 1);
        }
    }

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] != i + 1) {
            return i + 1;
        }
    }
    return nums.length + 1;
};