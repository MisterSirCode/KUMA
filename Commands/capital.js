const Discord = require("discord.js");

module.exports = {
    name: "capital",
    description: "",
    async execute(msg, args, Bot, Color, Version, Prefix) {
        if (msg.member.hasPermission("MANAGE_CHANNELS")) {
            let charList = {
                "A": "𝖠",
                "B": "𝖡",
                "C": "𝖢",
                "D": "𝖣",
                "E": "𝖤",
                "F": "𝖥",
                "G": "𝖦",
                "H": "𝖧",
                "I": "𝖨",
                "J": "𝖩",
                "K": "𝖪",
                "L": "𝖫",
                "M": "𝖬",
                "N": "𝖭",
                "O": "𝖮",
                "P": "𝖯",
                "Q": "𝖰",
                "R": "𝖱",
                "S": "𝖲",
                "T": "𝖳",
                "U": "𝖴",
                "V": "𝖵",
                "W": "𝖶",
                "X": "𝖷",
                "Y": "𝖸",
                "Z": "𝖹"
            };
            let chars = args.split("");
            let newString = "";
            chars.forEach(c => {
                let conv = charList[c];
                newString += conv || c;
            });
            const chanEmbed = new Discord.MessageEmbed()
                .setColor(defColor)
                .setTitle(`#${msg.channel.name} renamed to ${newString}`)
                .addField(`Warning`, `Channels can only be renamed twice every 10 minutes`, true);
            msg.channel.send(chanEmbed);
            msg.channel.setName(`${newString}`);
        } else {
            msg.channel.send(`I do not have permission to rename channels`);
        }
    }
};