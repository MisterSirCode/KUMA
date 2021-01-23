const Discord = require("discord.js");
const Fs = require("fs");

module.exports = {
    name: "help",
    description: "",
    async execute(msg, args) {
        Fs.readFile("Config/CommandList.json", (data) => {
            const helpData = JSON.parse(data);
            const helpEmbed = new Discord.MessageEmbed()
                .setColor(global.Color)
                .setTitle("Arthur's Command List")
                .setThumbnail(`https://deepworld.web.app/Images/sprocket.png`);
                for (command in helpData) {
                    const curCom = helpData[key];
                    if (curCom.perms)
                        helpEmbed.addField(`${global.Prefix}${key}`, `${curCom.desc}\n\nPermissions Required: ${curCom.perms.join(", ")}`);
                    else
                        helpEmbed.addField(`${global.Prefix}${key}`, `${curCom.desc}`);
                }
            Object.keys(helpData).forEach(key => {
            });
            msg.author.send(helpEmbed);
            msg.channel.send("Ive sent you the list");
        });
    }
};