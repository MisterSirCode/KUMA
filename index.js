require("dotenv").config({
    silent: true
});
const Discord = require("discord.js");
const Colors = require("colors");
const Fs = require("fs");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const prefix = require("./Commands/prefix");
const PrefixAdapter = new FileSync('./Databases/prefixes.json');
const PrefixDB = low(PrefixAdapter);
const TOKEN = process.env.TOKEN;

const Bot = new Discord.Client();
const Prefix = "a!";
const Color = "#F4BE25";
const Version = require("./package.json").version;
Bot.commands = new Discord.Collection();
const comFiles = Fs.readdirSync("./Commands").filter(file => file.endsWith(".js"));
for (const file of comFiles) {
    const commandFile = require(`./Commands/${file}`);
    Bot.commands.set(commandFile.name, commandFile);
}

Bot.login(TOKEN);

Bot.on("ready", () => {
    console.log(Colors.yellow(`Activated ${Bot.user.username}`));
    Bot.user.setPresence({
        status: "idle",
        activity: {
            name: `${Bot.guilds.cache.size} Servers`,
            type: "LISTENING",
            url: ""
        }
    });
});

Bot.on("message", async (msg) => {
    try {
        let curPrefix = prefix;
        const isDirectMessage = msg.channel.type === "dm";

        if (!isDirectMessage) {
            if (PrefixDB.get(`servers.${msg.guild.id}`)) curPrefix = PrefixDB.get(`servers.${msg.guild.id}`);
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

        Bot.commands.get(command.toLowerCase()).execute(msg, args, Bot, Color, Prefix, Version);
    } catch (e) {
        if (msg.author.id == "317796835265871873") {
            console.error(e);
        }
    }
});