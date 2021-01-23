const Discord = require("discord.js");
const Fs = require("fs");
const Util = require('util');

const readFile = Util.promisify(Fs.readFile);

module.exports = {
    name: "help",
    description: "",
    async execute(msg, args, Bot, Color, Prefix, Version) {
        readFile("./Config/CommandList.json").then((data) => {
            console.log(data.toString());
            const helpData = JSON.parse(data.toString());
            const helpEmbed = new Discord.MessageEmbed()
                .setColor(global.Color)
                .setTitle("Arthur's Command List")
                .setThumbnail(`https://deepworld.web.app/Images/sprocket.png`);
            Object.keys(helpData).forEach((key) => {
                const curCom = helpData[key];
                if (curCom.perms)
                    helpEmbed.addField(`${global.Prefix}${key}`, `${curCom.desc}\n\nPermissions Required: ${curCom.perms.join(", ")}`);
                else
                    helpEmbed.addField(`${global.Prefix}${key}`, `${curCom.desc}`);
            });
            msg.author.send(helpEmbed);
            if (msg.channel.type != "dm") {
                msg.delete();
            }
        });
    }
};