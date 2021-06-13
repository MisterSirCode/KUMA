require("dotenv").config();
const Discord = require("discord.js");
const Colors = require("colors");
const Fs = require("fs");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const TOKEN = process.env.TOKEN;
const Color = "#FF9600";
const Version = require("./package.json").version;
const Bot = new Discord.Client();
require('discord-buttons')(Bot);

Bot.commands = new Discord.Collection();
const comFiles = Fs.readdirSync("./Commands").filter(file => file.endsWith(".js"));
for (const file of comFiles) {
    const commandFile = require(`./Commands/${file}`);
    Bot.commands.set(commandFile.name, commandFile);
}

global.botOwner = "317796835265871873";
global.prefix = "!";
global.globalMods = [];
global.globalAdmins = [];
global.netSuperusers = [];
global.contributors = [];

global.reloadBotData = function() {
    const RanksAdapter = new FileSync("./Databases/userInformation.json");
    const RanksDB = lowdb(RanksAdapter);
    global.globalMods = global.globalAdmins = global.netSuperusers = global.contributors = [];
    for (let i = 0; i < Object.keys(RanksDB.get("users").value()).length; i++) {
        const key = Object.keys(RanksDB.get("users").value())[i];
        const value = RanksDB.get("users").value();
        if (value[key].rank >= 1) global.globalMods.push(value[key].uid);
        if (value[key].rank >= 2) global.globalAdmins.push(value[key].uid);
        if (value[key].rank >= 3) global.netSuperusers.push(value[key].uid);
        if (value[key].isContrib) global.contributors.push(value[key].uid);
    }
    botPresence("idle", `${Bot.guilds.cache.size} Servers`, "LISTENING");
}

Bot.on("message", async (msg) => {
    try {
        global.GBot = Bot;
        const isDirectMessage = msg.channel.type === "dm";
        const userIsGlobalMod = global.globalMods.includes(msg.author.id);
        const userIsGlobalAdmin = global.globalAdmins.includes(msg.author.id);
        const userIsNetSuperuser = global.netSuperusers.includes(msg.author.id);
        let curPrefix = global.prefix;
        if (msg.author.bot) return;
        if (msg.author.id === Bot.user.id) return;
        if (!isDirectMessage) {
            const PrefixAdapter = new FileSync("./Databases/prefixes.json");
            const PrefixDB = lowdb(PrefixAdapter);
            for (let i = 0; i < Object.keys(PrefixDB.get("servers").value()).length; i++) {
                const key = Object.keys(PrefixDB.get("servers").value())[i];
                const value = PrefixDB.get("servers").value();
                if (key == msg.guild.id) {
                    curPrefix = value[key];
                }
            }
            if (msg.content.toLowerCase() == "arthurs prefix") {
                msg.channel.send(`My prefix for this server is \`${curPrefix}\``);
                return;
            }
            if (!msg.content.startsWith(curPrefix)) return;
        }
        let command = msg.content.split(" ")[0].slice(curPrefix.length);
        let args = msg.content.replace(`${curPrefix + command}`, "").trim();
        if (isDirectMessage) {
            command = msg.content.split(" ")[0];
            args = msg.content.replace(`${command}`, "").trim();
        }
        
        if (!Bot.commands.has(command.toLowerCase())) return;
        try {
            Bot.commands.get(command.toLowerCase()).execute(msg, args, Bot, Color, Version, curPrefix);
        } catch (e) {
            if (userIsNetSuperuser) console.warn(e);
        }
    } catch (e) {
        if (global.netSuperusers.includes(msg.author.id)) console.warn(e);
    }
});


Bot.on("clickButton", () => {
    global.GBot = Bot;
});

// Extra Things

Bot.on("ready", async () => {
    global.isListening = true;
    const RanksAdapter = new FileSync("./Databases/userInformation.json");
    const RanksDB = lowdb(RanksAdapter);
    for (let i = 0; i < Object.keys(RanksDB.get("users").value()).length; i++) {
        const key = Object.keys(RanksDB.get("users").value())[i];
        const value = RanksDB.get("users").value();
        if (value[key].rank >= 1) global.globalMods.push(value[key].uid);
        if (value[key].rank >= 2) global.globalAdmins.push(value[key].uid);
        if (value[key].rank >= 3) global.netSuperusers.push(value[key].uid);
        if (value[key].isContrib) global.contributors.push(value[key].uid);
    }
    for (const [name, command] of Bot.commands) {
        Bot.commands.get(command.name.toLowerCase()).init(Bot, Color, Version);
    }
    botPresence("idle", `${Bot.guilds.cache.size} Servers`, "LISTENING");
    console.log("Bot Running");
});

Bot.on("guildCreate", () => {
    botPresence("idle", `${Bot.guilds.cache.size} Servers`, "LISTENING");
});

Bot.on("guildDelete", () => {
    botPresence("idle", `${Bot.guilds.cache.size} Servers`, "LISTENING");
});

Bot.on("guildMemberRemove", guildMember => {
    if (guildMember.guild.id === "731511745755217931") {
        Bot.channels.cache.get("741873813398224927").setName(`${guildMember.guild.memberCount} Users`);
    }
});

Bot.on("guildMemberAdd", (guildMember) => {
    if (guildMember.guild.id === "731511745755217931") {
        var role = guildMember.guild.roles.cache.find(role => role.name === "Member");
        var roleBaseColor = guildMember.guild.roles.cache.find(role => role.name === "Membergreen");
        guildMember.roles.add(role);
        guildMember.roles.add(roleBaseColor);
        Bot.channels.cache.get("741873813398224927").setName(`${guildMember.guild.memberCount} Users`);
    }
});

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