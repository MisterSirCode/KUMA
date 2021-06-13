const Discord = require("discord.js");
const {
    sign
} = require("mathjs");
const epochs = [
    ['Year', 31536000],
    ['Month', 2592000],
    ['Day', 86400],
    ['Hour', 3600],
    ['Minute', 60],
    ['Second', 1]
];

const getDuration = (timeAgoInSeconds) => {
    for (let [name, seconds] of epochs) {
        const interval = Math.round((timeAgoInSeconds / seconds) * 10) / 10;
        if (interval >= 1) {
            return {
                interval: interval,
                epoch: name
            };
        }
    }
};

const timeAgo = (date) => {
    const timeAgoInSeconds = Math.round(((new Date() - new Date(date)) / 1000) * 10) / 10;
    const {interval, epoch} = getDuration(timeAgoInSeconds);
    const suffix = interval === 1 ? '' : 's';
    return `${interval} ${epoch}${suffix}`;
};

module.exports = {
    name: "user",
    description: "",
    async execute(msg, args, Bot, Color, Version, Prefix) {
        if (!global.isListening) return;
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
            if (user.id == global.botOwner) ranks += "<:GlobalBotOwner:750527063752048661> ";
            if (member.id) {
                if (member.hasPermission("ADMINISTRATOR")) ranks += "<:ServerAdmin:750533242683261008> ";
                if (msg.guild.ownerID == member.id) ranks += "<:ServerOwner:749995280769745057> ";
            }
            if (member.id) userEmbed.setTitle(`${member.displayName}`);
            userEmbed.setDescription(`${ranks}\n\nCreated: ${member.user.createdAt.toDateString()}\nDiscord Age: ${timeAgo(member.user.createdAt)}`);
            msg.channel.send(userEmbed);
        } catch (e) { console.log(e) }
    },
    init(Bot, Color, Version) {

    }
};