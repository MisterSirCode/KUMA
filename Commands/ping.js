const Discord = require("discord.js");

module.exports = {
    name: "ping",
    description: "",
    async execute(msg, args) {
        const pingEmbed = new Discord.MessageEmbed()
            .setColor(global.Color)
            .setAuthor("Bot Status and Information", `https://cdn.discordapp.com/avatars/${global.Bot.user.id}/${global.Bot.user.avatar}.png`)
            .setTitle(`Android Arthur v${global.BotVersion}`)
            .addField("Ping", `${global.Bot.ws.ping}ms`)
            .addField("Servers", `${global.Bot.guilds.cache.size}`);
        msg.channel.send(pingEmbed);
    }
};