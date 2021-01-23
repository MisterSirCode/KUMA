const Discord = require("discord.js");
const { get } = require("lodash");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./Databases/prefixes.json');
const db = low(adapter);

db.defaults({ servers: {} }).write();

module.exports = {
    name: "prefix",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        if (!msg.member.hasPermission("MANAGE_GUILD") || msg.author.id != "317796835265871873") { msg.channel.send("You dont have permission to manage this guild"); return; }
        const prefix = args.replace(/\s+/g, "").replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g, "");
        if (db.get(`servers.${msg.guild.id}`)) db.update(`servers.${msg.author.id}`, prefix).write();
        else db.set(`servers.${msg.author.id}`, prefix).write();
        const pingEmbed = new Discord.MessageEmbed()
            .setColor(Color)
            .setAuthor(`Prefix changed to ${prefix}`, `${msg.guild.iconURL()}`);
        msg.channel.send(pingEmbed);
    }
};