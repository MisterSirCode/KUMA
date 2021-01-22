require("dotenv").config({ silent: true });
const Discord = require("discord.js");
const Colors = require("colors");
const Prompt = require('prompt');
const Fs = require("fs");
const TOKEN  = process.env.TOKEN;

global.Bot = new Discord.Client();
global.BotVersion = require("./package.json").version;
global.Bot.commands = new Discord.Collection();
const comFiles = Fs.readdirSync("./Commands").filter(file => file.endsWith(".js"));
for (const file of comFiles) {
    const commandFile = require(`./Commands/${file}`);
    global.Bot.commands.set(commandFile.name, commandFile);
}

// Prompts and Command Line Information

Prompt.start();
Prompt.get("Start Bot?", (err, results) => {
    console.log("Bot Started");
});