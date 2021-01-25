module.exports = {
    name: "ban",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        if (!msg.guild.me.hasPermission("BAN_MEMBERS"))
            return msg.channel.send("I do not have permission to Ban members");
        if (!msg.member.hasPermission("BAN_MEMBERS"))
            return msg.channel.send("You do have have permission to Ban members");
        const user = msg.mentions.users.first();
        if (!user)
            return msg.channel.send("Please specify a user to be Banned, with an optional reason");
        const member = msg.guild.member(user);
        if (!member)
            return msg.channel.send("That user is not in this guild");
        const newArgs = args.replace(/-p/g, "").replace(/\<\@\d+\>/g, "").replace(/\<\@\!\d+\>/g, "").trim();
        member.ban(`${args}`).then(() => {
            if (args.includes("-p")) {
                msg.channel.send(`${user} banned for "${newArgs}"`);
            } else {
                msg.delete();
            }
        });
    }
};