require("dotenv").config({ silent: true });
const Discord = require("discord.js");
const Keypress = require('keypress');
const Colors = require("colors");
const Prompt = require('prompt');
const Tty = require('tty');
const Fs = require("fs");
const TOKEN  = process.env.TOKEN;

global.Bot = new Discord.Client();
global.Prefix = "a!";
global.BotVersion = require("./package.json").version;
global.Bot.commands = new Discord.Collection();
const comFiles = Fs.readdirSync("./Commands").filter(file => file.endsWith(".js"));
for (const file of comFiles) {
    const commandFile = require(`./Commands/${file}`);
    global.Bot.commands.set(commandFile.name, commandFile);
}

global.Bot.on("ready", () => {
    global.Bot.user.setPresence({
        status: "idle",
        activity: {
            name: `${global.Bot.guilds.cache.size} Servers`,
            type: "LISTENING",
            url: "https://deepworld.web.app/"
        }
    });
});

console.log(`Logging in with ${TOKEN}`);
global.Bot.login(TOKEN);