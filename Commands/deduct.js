const Discord = require("discord.js");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const RanksAdapter = new FileSync("./Databases/userInformation.json");
const RanksDB = lowdb(RanksAdapter);

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

module.exports = {
    name: "deduct",
    description: "",
    async execute(msg, args, Bot, Color, Version, Prefix) {
        try {
            if (global.netSuperusers.includes(msg.author.id)) {
                let user;
                let userid;
                if (args.includes("<@") && args.includes(">")) {
                    userid = args.slice(2, -1);
                    if (userid.startsWith("!")) userid = userid.slice(1);
                    user = await Bot.users.fetch(userid);
                } else {
                    if (args.length) user = await Bot.users.fetch(args);
                    else {
                        user = msg.author;
                        userid = msg.author.id;
                    }
                }
                let member = await msg.guild.member(user);
                let role = 0;
                let rolesText = ["Member", "Global Moderator", "Global Administrator", "Network Superuser"];
                for (let i = 0; i < Object.keys(RanksDB.get("users").value()).length; i++) {
                    const key = Object.keys(RanksDB.get("users").value())[i];
                    const value = RanksDB.get("users").value();
                    if (value[key].uid == user.id) {
                        role = value[key].rank;
                    }
                }
                if (role <= 0) {
                    msg.channel.send("This user is already a Member and cannot be deducted any lower");
                } else {
                    RanksDB.get("users").set(`${user.id}.rank`, clamp(role - 1, 0, 3)).set(`${user.id}.isBotOwner`, false).set(`${user.id}.uid`, user.id).write();
                    for (let i = 0; i < Object.keys(RanksDB.get("users").value()).length; i++) {
                        const key = Object.keys(RanksDB.get("users").value())[i];
                        const value = RanksDB.get("users").value();
                        global.globalMods = global.globalAdmins = global.netSuperusers = [];
                        if (value[key].rank >= 1) global.globalMods.push(value[key].uid);
                        if (value[key].rank >= 2) global.globalAdmins.push(value[key].uid);
                        if (value[key].rank >= 3) global.netSuperusers.push(value[key].uid);
                    }
                    const userEmbed = new Discord.MessageEmbed()
                        .setTitle(`${user.username} has been deducted`)
                        .setColor(Color)
                        .setDescription(`From **${rolesText[clamp(role, 0, 3)]}** to **${rolesText[clamp(role - 1, 0, 3)]}**`)
                        .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`);
                    if (member.id) userEmbed.setTitle(`${member.displayName} has been deducted`);
                    msg.channel.send(userEmbed);
                }
            }
        } catch (e) {}
    }
};