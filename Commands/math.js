const Discord = require("discord.js");
const {
    evaluate
} = require('mathjs');

module.exports = {
    name: "m",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        if (!global.isListening) return;
        // try {
        //     const mathEmbed = new Discord.MessageEmbed()
        //         .setColor(Color)
        //         .setTitle(`${result}`);
        //     msg.channel.send(mathEmbed);
        // } catch (e) {
        //     console.log(e);
        // }
        msg.channel.send("Math is currently disabled because of a major vulnerability");
    },
    init(Bot, Color, Version) {

    }
};