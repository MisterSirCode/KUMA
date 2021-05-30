const Discord = require("discord.js");
const Fs = require("fs");
const Util = require('util');
const readFile = Util.promisify(Fs.readFile);

module.exports = {
    name: "help",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        if (!global.isListening) return;
        readFile("./Config/CommandList.json").then((data) => {
            const helpData = JSON.parse(data.toString());
            const helpEmbed = new Discord.MessageEmbed()
                .setColor(Color)
                .setTitle("Arthur's Command List")
                .setThumbnail(`https://deepworld.web.app/Images/sprocket.png`);
            Object.keys(helpData).forEach((key) => {
                const curCom = helpData[key];
                if (curCom.perms)
                    helpEmbed.addField(`${Prefix}${key}`, `${curCom.desc}\n\nPermissions Required: ${curCom.perms.join(", ")}`);
                else
                    helpEmbed.addField(`${Prefix}${key}`, `${curCom.desc}`);
            });
            msg.author.send(helpEmbed);
            if (msg.channel.type != "dm") {
                msg.delete();
            }
        });
    },
    init(Bot, Color, Version) {

    }
};