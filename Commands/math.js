const Discord = require("discord.js");
const { evaluate } = require('mathjs');

module.exports = {
    name: "m",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        // try {
        //     const mathEmbed = new Discord.MessageEmbed()
        //         .setColor(Color)
        //         .setTitle(`${evaluate(args)}`);
        //     msg.channel.send(mathEmbed);
        // } catch(e) {
        //     // overflow errors begone!
        // }
        msg.channel.send("Due to Major Vulnerabilities discovered in MathJS, this command has been disabled for now");
    }
};