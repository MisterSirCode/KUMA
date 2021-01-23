require("dotenv").config({ silent: true });
const Discord = require("discord.js");
const Keypress = require('keypress');
const Colors = require("colors");
const Fs = require("fs");
const TOKEN  = process.env.TOKEN;

global.Bot = new Discord.Client();
global.Prefix = "a!";
global.Color = "#F4BE25";
global.BotVersion = require("./package.json").version;
global.Bot.commands = new Discord.Collection();
const comFiles = Fs.readdirSync("./Commands").filter(file => file.endsWith(".js"));
for (const file of comFiles) {
    const commandFile = require(`./Commands/${file}`);
    global.Bot.commands.set(commandFile.name, commandFile);
}

global.Bot.login(TOKEN);

global.Bot.on("ready", () => {
    console.log(`Logged in as ${global.Bot.user.name}`);
    global.Bot.user.setPresence({
        status: "idle",
        activity: {
            name: `${global.Bot.guilds.cache.size} Servers`,
            type: "LISTENING",
            url: ""
        }
    });
});

global.Bot.on("message", async (msg) => {
    try {
        if (msg.author.bot) return;
        if (msg.author.id === global.Bot.user.id) return;

        let command = msg.content.split(" ")[0].slice(global.Prefix.length);
        let args = msg.content.replace(`${global.Prefix + command}`, "").trim();
        if (!global.Bot.commands.has(command.toLowerCase())) return;
        
        global.Bot.commands.get(command.toLowerCase()).execute(msg, args);
    } catch(e) {
        if (msg.author.id == 317796835265871873) {
            msg.author.send(`${e}`);
        }
    } 
}); 

