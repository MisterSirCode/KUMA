const Discord = require("discord.js");
const {
    sign
} = require("mathjs");

module.exports = {
    name: "user",
    description: "",
    async execute(msg, args, Bot, Color, Version, Prefix) {
        try {
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
            // msg.channel.send(`${user.username}#${user.discriminator} --- ${user.id}`);
            const userEmbed = new Discord.MessageEmbed()
                .setTitle(`${user.username}`)
                .setColor(Color)
                .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
                .setFooter(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`);
            let ranks = "";
            if (global.globalMods.includes(user.id)) {
                ranks += "<:GlobalBotMod:750528606924570745> ";
                if (global.globalAdmins.includes(user.id)) {
                    ranks += "<:GlobalBotAdmin:750528606996004964> ";
                    if (global.netSuperusers.includes(user.id)) {
                        ranks += "<:GlobalBotSuperuser:750170311348977745> ";
                    }
                }
            }
            if (global.contributors.includes(user.id)) {
                ranks += "<:Contributor:810843786707992577> ";
            }
            if (user.id == "317796835265871873") ranks += "<:GlobalBotOwner:750527063752048661> ";
            if (member.id) {
                if (member.hasPermission("ADMINISTRATOR")) ranks += "<:ServerAdmin:750533242683261008> ";
                if (msg.guild.ownerID == member.id) ranks += "<:ServerOwner:749995280769745057> ";
            }
            if (member.id) userEmbed.setTitle(`${member.displayName}`);
            userEmbed.setDescription(ranks);
            msg.channel.send(userEmbed);
        } catch (e) {
            msg.channel.send(`${e}`);
        }
    }
};