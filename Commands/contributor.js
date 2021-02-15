const Discord = require("discord.js");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const RanksAdapter = new FileSync("./Databases/userInformation.json");
const RanksDB = lowdb(RanksAdapter);

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

module.exports = {
    name: "contrib",
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
                let rolesText = ["Member", "Server Contributor"];
                for (let i = 0; i < Object.keys(RanksDB.get("users").value()).length; i++) {
                    const key = Object.keys(RanksDB.get("users").value())[i];
                    const value = RanksDB.get("users").value();
                    if (value[key].uid == user.id) {
                        role = value[key].isContrib || 0;
                    }
                }
                if (role >= 3) {
                    msg.channel.send("This user is already a Server Contributor and cannot be inducted any higher");
                } else {
                    RanksDB.get("users").set(`${user.id}.isContrib`, RanksDB.get(`users.${user.id}.isContrib`).value() || 0).set(`${user.id}.isContrib`, true).set(`${user.id}.isBotOwner`, false).set(`${user.id}.uid`, user.id).write();
                    for (let i = 0; i < Object.keys(RanksDB.get("users").value()).length; i++) {
                        const key = Object.keys(RanksDB.get("users").value())[i];
                        const value = RanksDB.get("users").value();
                        global.contributors = [];
                        if (value[key].isContrib) global.contributors.push(value[key].uid);
                    }
                    const userEmbed = new Discord.MessageEmbed()
                        .setTitle(`${user.username} has been inducted`)
                        .setColor(Color)
                        .setDescription(`From **${rolesText[clamp(role, 0, 1)]}** to **${rolesText[clamp(role + 1, 0, 1)]}**`)
                        .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`);
                    if (member.id) userEmbed.setTitle(`${member.displayName} has been inducted`);
                    msg.channel.send(userEmbed);
                }
            }
        } catch (e) {}
    }
};