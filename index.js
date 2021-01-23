require("dotenv").config();
const Discord = require("discord.js");
const Colors = require("colors");
const Fs = require("fs");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const RanksAdapter = new FileSync("./Databases/userRanks.json");
const RanksDB = lowdb(RanksAdapter);
const TOKEN = process.env.TOKEN;
const Prefix = "!";
const Color = "#FF9600";
const Version = require("./package.json").version;
const Bot = new Discord.Client();

Bot.commands = new Discord.Collection();
const comFiles = Fs.readdirSync("./Commands").filter(file => file.endsWith(".js"));
for (const file of comFiles) {
    const commandFile = require(`./Commands/${file}`);
    Bot.commands.set(commandFile.name, commandFile);
}

global.globalMods = [];
global.globalAdmins = [];
global.netSuperusers = [];

Bot.on("message", async (msg) => {
    try {
        const isDirectMessage = msg.channel.type === "dm";
        const userIsGlobalMod = global.globalMods.includes(msg.author.id);
        const userIsGlobalAdmin = global.globalAdmins.includes(msg.author.id);
        const userIsNetSuperuser = global.netSuperusers.includes(msg.author.id);
        var curPrefix = Prefix;
        if (!isDirectMessage) {
            const PrefixAdapter = new FileSync("./Databases/prefixes.json");
            const PrefixDB = lowdb(PrefixAdapter);
            for (let i = 0; i < Object.keys(PrefixDB.get("servers").value()).length; i++) {
                const key = Object.keys(PrefixDB.get("servers").value())[i];
                const value = PrefixDB.get("servers").value();
                console.log(key, value[key]);
                curPrefix = value[key];
            }
            if (!msg.content.startsWith(curPrefix)) return;
        }
        if (msg.author.bot) return;
        if (msg.author.id === Bot.user.id) return;
        let command = msg.content.split(" ")[0].slice(curPrefix.length);
        let args = msg.content.replace(`${curPrefix + command}`, "").trim();
        if (isDirectMessage) {
            command = msg.content.split(" ")[0];
            args = msg.content.replace(`${command}`, "").trim();
        }
        if (!Bot.commands.has(command.toLowerCase())) return;
        try {
            Bot.commands.get(command.toLowerCase()).execute(msg, args, Bot, Color, Version, Prefix);
        } catch (e) {
            if (userIsNetSuperuser) console.warn(e);
        }
    } catch (e) {
        if (global.netSuperusers.includes(msg.author.id)) console.warn(e);
    }
});

// Extra Things

Bot.on("ready", async () => {
    // const prefRead = await fs.promises.readFile(`Codex/Prefixes.json`);
    // const prefData = JSON.parse(prefRead);
    // global.serPrefixes = prefData;
    // bot.guilds.cache.forEach((guild) => {
    //     if (!global.serPrefixes[guild.id]) global.serPrefixes[guild.id] = prefix;
    // });
    // var status = "idle";
    for (const user in RanksDB.get("users")) {
        if (user.isGlobalModerator) global.globalMods.push(user.uid);
        if (user.isGlobalAdministrator) global.globalMods.push(user.uid);
        if (user.isNetworkSuperuser) global.netSuperusers.push(user.uid);
    }
    botPresence("idle", `${Bot.guilds.cache.size} Servers`, "LISTENING");
});

Bot.on("guildCreate", () => {
    botPresence("idle", `${Bot.guilds.cache.size} Servers`, "LISTENING");
});

Bot.on("guildDelete", () => {
    botPresence("idle", `${Bot.guilds.cache.size} Servers`, "LISTENING");
})

// bot.on("guildMemberRemove", guildMember => {
//     if (guildMember.guild.id == "731511745755217931") {
//         bot.channels.cache.get("741873813398224927").setName(`${guildMember.guild.memberCount} Users`);
//         bot.channels.cache.get("742083593282650224").send(
//             `User #${guildMember.guild.memberCount}, ${guildMember.user} just left`);
//     }
// });

// bot.on("guildMemberAdd", (guildMember) => {
//     if (guildMember.guild.id == "731511745755217931") {
//         var role = guildMember.guild.roles.cache.find(role => role.name === "Member");
//         var roleBaseColor = guildMember.guild.roles.cache.find(role => role.name === "Membergreen");
//         guildMember.roles.add(role);
//         guildMember.roles.add(roleBaseColor);
//         bot.channels.cache.get("741873813398224927").setName(`${guildMember.guild.memberCount} Users`);
//         bot.channels.cache.get("742083593282650224").send(
//             `User #${guildMember.guild.memberCount}, ${guildMember.user} just joined`);
//     }
// });

Bot.login(TOKEN);

function botPresence(statusText, text, type) {
    Bot.user.setPresence({
        status: statusText,
        activity: {
            name: text,
            type: type
        }
    });
}