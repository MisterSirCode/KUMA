const Discord = require("discord.js");

module.exports = {
    name: "help",
    description: "",
    async execute(msg, args) {
        const helpRead = fs.readFileSync("Config/CommandList.json");
        const helpData = JSON.parse(helpRead);
        const helpEmbed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Arthur's Command List")
            .setThumbnail(`https://deepworld.web.app/Images/sprocket.png`);
        Object.keys(helpData).forEach(key => {
            const curCom = helpData[key];
            if (curCom.perms) {
                helpEmbed.addField(`${global.prefix}${key}`, `${curCom.desc}\n\nPermissions Required: ${curCom.perms.join(", ")}`);
            } else {
                helpEmbed.addField(`${global.prefix}${key}`, `${curCom.desc}`);
            }
        });
        msg.author.send(helpEmbed);
        msg.channel.send("Ive sent you the list");
    }
};