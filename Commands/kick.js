module.exports = {
    name: "kick",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        try {
            if (!msg.guild.me.hasPermission("KICK_MEMBERS"))
                return msg.channel.send("I do not have permission to Kick members");
            if (!msg.member.hasPermission("KICK_MEMBERS"))
                return msg.channel.send("You do have have permission to Kick members");
            if (!/(\<\@\d+\>|\<\@\!\d+\>)/g.test(args))
                return msg.channel.send("Please specify a user to be Kicked, with an optional reason");
            let parameters = args;
            if (args.match(/(\s+|)-[a-z]+(\s+|)/gi))
                parameters = args.match(/(\s+|)-[a-z]+(\s+|)/gi)[0].replace(/\s+/g,"").match(/[a-z]/gi);
            args = args.replace(/(\s+|)-[a-z]+(\s+|)/gi, "");
            const users = args.match(/(\<\@\d+\>|\<\@\!\d+\>)/g);
            const desc = args.replace(/(\s+|)(\<\@\d+\>|\<\@\!\d+\>)(\s+|)/g, "");
            users.forEach((user) => {
                const userid = user.match(/\d+/g)[0];
                msg.guild.members.fetch({ user: userid, force: true }).then((member) => {
                    if (!member.id) msg.channel.send(`${user} is not in this guild`);
                    else {
                        member.kick(`${args}`).then(() => {
                            if (parameters.includes("p")) {
                                msg.channel.send(`${user} Kicked for "${desc}"`);
                            } else {
                                msg.delete();
                            }
                        });
                    }
                });
            });
        } catch(e) {
            console.log(e);
        }
    }
};