const Discord = require("discord.js");
const { MessageButton } = require("discord-buttons");

module.exports = {
    name: "control",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        const controlPanel = new Discord.MessageEmbed()
            .setColor("#000000")
            .setTitle("Android Arthur's Control Panel")
            .addField("Listening", `${global.isListening}`, true);
        const toggleListening = new MessageButton()
                    .setStyle(global.isListening ? "green" : "red")
                    .setLabel(global.isListening ? "Listening On" : "Listening Off")
                    .setID("toggleListening");
        msg.channel.send("", {
            embed: controlPanel,
            buttons: [
                toggleListening
            ]
        });
    },
    init(Bot, Color, Version) {
        Bot.on("clickButton", async (button) => {
            if (button.id === "toggleListening") {
                const NewBot = global.GBot;
                global.isListening = !global.isListening;
                const controlPanel = new Discord.MessageEmbed()
                    .setColor("#000000")
                    .setTitle("Android Arthur's Control Panel")
                    .addField("Listening", `${global.isListening}`, true);
                const toggleListening = new MessageButton()
                    .setStyle(global.isListening ? "green" : "red")
                    .setLabel(global.isListening ? "Listening On" : "Listening Off")
                    .setID("toggleListening");
                button.message.edit("", {
                    embed: controlPanel,
                    buttons: [
                        toggleListening
                    ]
                });
                button.defer();
            }
        });
    }
};