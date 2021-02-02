const Discord = require("discord.js");

module.exports = {
    name: "eval",
    description: "",
	execute(msg, args, Bot, Color, Version, Prefix) {
        if (msg.author.id === "317796835265871873") {
            var newArgs = args.replace(/(\s+|)-[a-z]+(\s+|)/, "");
            let output;
            try {
                output = eval(newArgs);
            } catch(e) {
                output = `${e}`;
            }
            if (args.includes("-o")) {
                const evalEmbed = new Discord.MessageEmbed()
                    .setColor(Color)
                    .setTitle(output);
                msg.channel.send(evalEmbed);
            }
            if (args.includes("-d")) {
                msg.delete();
            }
        }
    }
};