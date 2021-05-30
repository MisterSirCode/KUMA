const Discord = require("discord.js");
const { MessageButton } = require("discord-buttons");

module.exports = {
    name: "ping",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        if (!global.isListening) return;
        const pingEmbed = new Discord.MessageEmbed()
            .setColor(Color)
            .setAuthor("Bot Status and Information", `https://cdn.discordapp.com/avatars/${Bot.user.id}/${Bot.user.avatar}.png`)
            .setTitle(`Android Arthur v${Version}`)
            .addField("Ping", `${Bot.ws.ping}ms`, true)
            .addField("Guilds", `${Bot.guilds.cache.size}`, true);
        const refreshButton = new MessageButton()
                    .setStyle("blurple")
                    .setLabel("Refresh Ping")
                    .setID("refreshPingButton");
        msg.channel.send("", {
            embed: pingEmbed,
            buttons: [
                refreshButton
            ]
        });
    },
    init(Bot, Color, Version) {
        Bot.on("clickButton", async (button) => {
            if (button.id === "refreshPingButton") {
                try {
                    const NewBot = global.GBot;
                    const pingEmbed = new Discord.MessageEmbed()
                        .setColor(Color)
                        .setAuthor("Bot Status and Information", `https://cdn.discordapp.com/avatars/${NewBot.user.id}/${NewBot.user.avatar}.png`)
                        .setTitle(`Android Arthur v${Version}`)
                        .addField("Ping", `${NewBot.ws.ping}ms`, true)
                        .addField("Guilds", `${NewBot.guilds.cache.size}`, true);
                    const refreshButton = new MessageButton()
                        .setStyle("blurple")
                        .setLabel("Refresh Ping")
                        .setID("refreshPingButton")
                        .setDisabled(true);
                    button.message.edit("", {
                        embed: pingEmbed,
                        buttons: [refreshButton]
                    });
                    setTimeout(() => {
                        const refreshButtonOn = new MessageButton()
                            .setStyle("blurple")
                            .setLabel("Refresh Ping")
                            .setID("refreshPingButton");
                        button.message.edit("", {
                            embed: pingEmbed,
                            buttons: [refreshButtonOn]
                        });
                        try {
                            button.defer();
                        } catch(e) {
                            // oh wells
                        }
                    }, 3000);
                } catch(e) {
                    button.defer();
                }
            }
        });
    }
};