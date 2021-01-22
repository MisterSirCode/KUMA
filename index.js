require("dotenv").config({ silent: true });
const Discord = require("discord.js");
const Keypress = require('keypress');
const Colors = require("colors");
const Prompt = require('prompt');
const Tty = require('tty');
const Fs = require("fs");
const TOKEN  = process.env.TOKEN;

let botOnline = false;

global.Bot = new Discord.Client();
global.BotVersion = require("./package.json").version;
global.Bot.commands = new Discord.Collection();
const comFiles = Fs.readdirSync("./Commands").filter(file => file.endsWith(".js"));
for (const file of comFiles) {
    const commandFile = require(`./Commands/${file}`);
    global.Bot.commands.set(commandFile.name, commandFile);
}

// Prompts and Command Line Information

console.log("Press Y to start the Discord Bot");

Keypress(process.stdin);
process.stdin.on('keypress', function (ch, key) {
    if (key && key.name == "y" && botOnline == false) {
        console.clear();
        botOnline = true;
        // global.Bot.login(TOKEN);
    }
});