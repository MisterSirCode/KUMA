const Discord = require("discord.js");
const { MessageButton } = require("discord-buttons");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

module.exports = {
    name: "forcereload",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        if (!global.isListening) return;
        const pingEmbed = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setTitle("Are you sure you want to reload?")
        const reloadButton = new MessageButton()
                    .setStyle("green")
                    .setLabel("Reload")
                    .setID("reloadBotButton");
        msg.channel.send("", {
            embed: pingEmbed,
            buttons: [
                reloadButton
            ]
        });
    },
    init(Bot, Color, Version) {
        Bot.on("clickButton", async (button) => {
            if (button.id === "reloadBotButton") {
                try {
                    global.reloadBotData();
                    const NewBot = global.GBot;
                    const pingEmbed = new Discord.MessageEmbed()
                        .setColor("#ff0000")
                        .setTitle("Are you sure you want to reload?")
                    const reloadButtonEx = new MessageButton()
                        .setStyle("red")
                        .setLabel("Reloaded")
                        .setID("reloadBotButtonEx")
                        .setDisabled(true);
                    button.message.edit("", {
                        embed: pingEmbed,
                        buttons: [reloadButtonEx]
                    });
                } catch (e) { console.log(e) }
            }
        });
    }
};