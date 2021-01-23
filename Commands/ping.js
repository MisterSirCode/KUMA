const Discord = require("discord.js");

module.exports = {
    name: "ping",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        const pingEmbed = new Discord.MessageEmbed()
            .setColor(Color)
            .setAuthor("Bot Status and Information", `https://cdn.discordapp.com/avatars/${Bot .user.id}/${Bot .user.avatar}.png`)
            .setTitle(`Android Arthur v${Version}`)
            .addField("Ping", `${Bot.ws.ping}ms`, true)
            .addField("Guilds", `${Bot.guilds.cache.size}`, true);
        msg.channel.send(pingEmbed);
    }
};