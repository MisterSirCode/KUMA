module.exports = {
    name: "eval",
    description: "",
	execute(msg, args, Bot, Color, Version, Prefix) {
        if (msg.author.id === "317796835265871873") {
            var newArgs = args.replace(/-l/, "");
            let output;
            try {
                output = eval(newArgs);
            } catch(e) {
                output = `${e}`;
            }
            if (args.includes("-l")) {
                const evalEmbed = new Discord.MessageEmbed()
                    .setColor(defColor)
                    .setTitle(output);
                msg.channel.send(evalEmbed);
            }
        } else {
            msg.channel.send(`Missing Permission "Network Superuser"`);
        }
    }
};