const Discord = require("discord.js");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const PrefixAdapter = new FileSync('./Databases/prefixes.json');
const PrefixDB = low(PrefixAdapter);

module.exports = {
    name: "prefix",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        if (msg.member.hasPermission("MANAGE_GUILD") || msg.author.id == "317796835265871873") {
            const pingEmbed = new Discord.MessageEmbed()
                .setColor(Color)
                .setAuthor("Prefix being updated...", `${msg.guild.iconURL()}`);
            msg.channel.send(pingEmbed).then(oldMsg => {
                PrefixDB.defaults("servers").set(`${msg.guild.id}`, Prefix).write();
                const prefix = args.replace(/\s+/g, "").replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g, "");
                PrefixDB.get("servers").set(`${msg.guild.id}`, prefix).write();
                const newPingEmbed = new Discord.MessageEmbed()
                    .setColor(Color)
                    .setAuthor(`Prefix changed to ${prefix}`, `${msg.guild.iconURL()}`);
                oldMsg.edit(newPingEmbed);
            });
        } else {
            msg.channel.send("You dont have permission to Manage this Guild");
            return;
        }
    }
};