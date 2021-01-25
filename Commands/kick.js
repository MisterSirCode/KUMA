module.exports = {
    name: "kick",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        if (!msg.guild.me.hasPermission("KICK_MEMBERS"))
            return msg.channel.send("I do not have permission to Kick members");
        if (!msg.member.hasPermission("KICK_MEMBERS"))
            return msg.channel.send("You do have have permission to Kick members");
        const user = msg.mentions.users.first();
        if (!user)
            return msg.channel.send("Please specify a user to be Kicked, with an optional reason");
        const member = msg.guild.member(user);
        if (!member)
            return msg.channel.send("That user is not in this guild");
        const newArgs = args.replace(/-p/g, "").replace(/\<\@\d+\>/g, "").replace(/\<\@\!\d+\>/g, "").trim();
        member.kick(`${args}`).then(() => {
            if (args.includes("-p")) {
                msg.channel.send(`${user} kicked for "${newArgs}"`);
            } else {
                msg.delete();
            }
        });
    }
};