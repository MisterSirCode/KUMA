const Discord = require("discord.js");

module.exports = {
    name: "user",
    description: "",
    async execute(msg, args, Bot, Color, Version, Prefix) {
        let user;
        if (args.includes("<@") && args.includes(">")) {
            var userid = args.slice(2, -1);
            if (userid.startsWith("!")) userid = userid.slice(1);
            user = await Bot.users.fetch(userid);
        } else {
            if (args.length) user = await Bot.users.fetch(args);
            else user = msg.author;
        }
        let guildMap = Bot.guilds.cache;
        let guilds = guildMap.map(guild => guild.id);
        let guildFound = false;
        guilds.forEach(guildId => {
            if (!guildFound) {
                let guild;
                if (msg.guild.member(user)) guild = msg.guild;
                else guild = guildMap.get(guildId);
                if (guild.member(user)) {
                    let member = guild.member(user);
                    var titleTags = ``;
                    if (user.bot) titleTags = `<:bot:749361433413681262> Bot\n`;
                    if (member.hasPermission(`ADMINISTRATOR`)) {
                        if (user.id == guild.ownerID) titleTags += `<:ServerOwner:749995280769745057> Server Owner\n`;
                        else titleTags += `<:ServerAdmin:750533242683261008> Server Admin\n`;
                    }
                    if (global.globalMods.includes(user.id)) {
                        if (global.globalAdmins.includes(user.id)) {
                            if (global.netSuperusers.includes(user.id)) {
                                if (user.id == `317796835265871873`) titleTags += `<:GlobalBotOwner:750527063752048661> Bot Creator\n`;
                                else titleTags += `<:GlobalBotSuperuser:750170311348977745> Global Superuser\n`;
                            } else titleTags += `<:GlobalBotAdministrator:750528606924570745> Global Admin\n`;
                        } else titleTags += `<:GlobalBotModerator:750528606996004964> Global Mod\n`;
                    }
                    if (titleTags == ``) titleTags = `None`;
                    const userEmbed = new Discord.MessageEmbed()
                        .setTitle(`${member.nickname || user.username}`)
                        .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`)
                        .setColor(`${member.displayHexColor}`)
                        .addField(`Ranks`, `${titleTags}`)
                        .setFooter(`${user.username}#${user.discriminator} was found on the guild "${member.guild.name}"`, `${member.guild.iconURL()}`);
                    msg.channel.send(userEmbed);
                    guildFound = true;
                }
            }
        });
    }
};