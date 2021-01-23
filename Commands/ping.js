const Discord = require("discord.js");

module.exports = {
    name: "ping",
    description: "",
    async execute(msg, args, Bot, Color, Prefix, Version) {
        const pingEmbed = new Discord.MessageEmbed()
            .setColor(global.Color)
            .setAuthor("Bot Status and Information", `https://cdn.discordapp.com/avatars/${Bot .user.id}/${Bot .user.avatar}.png`)
            .setTitle(`Android Arthur v${Version}`)
            .addField("Ping", `${Bot.ws.ping}ms`, true)
            .addField("Guilds", `${Bot.guilds.cache.size}`, true);
        msg.channel.send(pingEmbed);
    }
};