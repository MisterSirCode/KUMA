const Discord = require("discord.js");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const PrefixAdapter = new FileSync('./Databases/prefixes.json');
const PrefixDB = low(PrefixAdapter);

module.exports = {
    name: "clear",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        if (!global.isListening) return;
        if (msg.member.hasPermission("MANAGE_GUILD") || msg.author.id == "317796835265871873") {
            const pingEmbed = new Discord.MessageEmbed()
                .setColor(Color)
                .setAuthor("Removing Information...", `${msg.guild.iconURL()}`);
            msg.channel.send(pingEmbed).then(oldMsg => {
                PrefixDB.get("servers").set(`${msg.guild.id}`, global.prefix).write();
                const newPingEmbed = new Discord.MessageEmbed()
                    .setColor(Color)
                    .setAuthor(`Removed server information from Android Arthur and reset prefix for ${msg.guild.name}`, `${msg.guild.iconURL()}`);
                oldMsg.edit(newPingEmbed);
            });
        } else {
            msg.channel.send("You dont have permission to manage this guild");
            return;
        }
    },
    init(Bot, Color, Version) {

    }
};