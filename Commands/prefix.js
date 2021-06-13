const Discord = require("discord.js");
const { MessageButton } = require("discord-buttons");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const PrefixAdapter = new FileSync('./Databases/prefixes.json');
const PrefixDB = low(PrefixAdapter);
const OldPrefixAdapter = new FileSync('./Databases/previousPrefixes.json');
const OldPrefixDB = low(OldPrefixAdapter);

module.exports = {
    name: "prefix",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        if (!global.isListening) return;
        if (msg.member.hasPermission("MANAGE_GUILD") || msg.author.id == global.botOwner) {
            const pingEmbed = new Discord.MessageEmbed()
                .setColor(Color)
                .setAuthor("Prefix being updated...", `${msg.guild.iconURL()}`);
            const resetButton = new MessageButton()
                    .setStyle("gray")
                    .setLabel("Undo Changes")
                    .setID("resetPrefixButton");
            msg.channel.send("", {
                embed: pingEmbed,
                buttons: [resetButton]
            }).then(oldMsg => {
                PrefixDB.defaults("servers").set(`${msg.guild.id}`, Prefix).write();
                OldPrefixDB.defaults("servers").set(`${msg.guild.id}`, Prefix).write();
                const prefix = args.replace(/\s+/g, "").replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g, "");
                PrefixDB.get("servers").set(`${msg.guild.id}`, prefix).write();
                OldPrefixDB.get("servers").set(`${msg.guild.id}`, Prefix).write();
                const newPingEmbed = new Discord.MessageEmbed()
                    .setColor(Color)
                    .setAuthor(`Prefix changed to ${prefix}`, `${msg.guild.iconURL()}`);
                oldMsg.edit("", {
                    embed: newPingEmbed,
                    buttons: [resetButton]
                });
            });
        } else {
            msg.channel.send("You dont have permission to Manage this Guild");
            return;
        }
    },
    init(Bot, Color, Version) {
        Bot.on("clickButton", async (button) => {
            if (button.id === "resetPrefixButton" && (button.clicker.member.hasPermission("MANAGE_GUILD") || button.clicker.member.id == "317796835265871873")) {
                const PrefixAdapter = new FileSync('./Databases/prefixes.json');
                const PrefixDB = low(PrefixAdapter);
                const OldPrefixAdapter = new FileSync("./Databases/previousPrefixes.json");
                const OldPrefixDB = low(OldPrefixAdapter);
                const newPrefixEmbed = new Discord.MessageEmbed()
                    .setColor(Color)
                    .setAuthor(`Prefix change canceled`, `${button.message.guild.iconURL()}`);
                const newButton = new MessageButton()
                    .setStyle("red")
                    .setLabel("Changes Removed")
                    .setID("disabledRedButton")
                    .setDisabled(true);
                const oldPrefix = OldPrefixDB.get("servers").get(`${button.message.guild.id}`).value();
                PrefixDB.get("servers").set(`${button.message.guild.id}`, oldPrefix).write();
                button.message.edit("", {
                    embed: newPrefixEmbed,
                    buttons: [newButton]
                });
                button.defer();
            } else {
                button.defer();
            }
        });
    }
};