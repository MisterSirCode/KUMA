const Discord = require("discord.js");

module.exports = {
    name: "eval",
    description: "",
	execute(msg, args, Bot, Color, Version, Prefix) {
        if (msg.author.id === "317796835265871873") {
            try {
                var parameters = args.match(/(\s+|)-[a-z]+(\s+|)/gi)[0].replace(/\s+/g,"").match(/[a-z]/gi);
                args = args.replace(/(\s+|)-[a-z]+(\s+|)/gi, "");
                let output;
                try {
                    output = eval(newArgs);
                } catch(e) {
                    output = `${e}`;
                }
                if (parameters.includes("o")) {
                    const evalEmbed = new Discord.MessageEmbed()
                        .setColor(Color)
                        .setTitle(output);
                    msg.channel.send(evalEmbed);
                }
                if (parameters.includes("d")) {
                    msg.delete();
                }
            } catch(e) {
                // Caught
            }
        }
    }
};