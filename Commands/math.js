const Discord = require("discord.js");
const Wp = require('workerpool');
const { evaluate } = require('mathjs');

module.exports = {
    name: "m",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        // try {
        //     const pool = Wp.pool();
        //     const argsArray = [];
        //     argsArray.push(args);
        //     pool.exec(evaluate, [args])
        //     .then(function(result) {
        //         const mathEmbed = new Discord.MessageEmbed()
        //             .setColor(Color)
        //             .setTitle(`${result}`);
        //         msg.channel.send(mathEmbed);
        //     })
        //     .catch(function(err) {
        //         console.log(err);
        //     })
        //     .then(function() {
        //         pool.terminate();
        //     })
        // } catch(e) {
        //     console.log(e);
        // }
        msg.channel.send("Math is currently disabled because of a major vulnerability");
    }
};