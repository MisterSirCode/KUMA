const { Client, Collection, REST, GatewayIntentBits, 
        Partials, Routes, EmbedBuilder, ActivityType } = require('discord.js');
const config = require('./config.json');
const pkg = require('./package.json');
const colors = require('colors');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { override } = require('./commands/speak');
const commandFiles = 'ban guild help kick mute ping purge rules speak user'.split(' ');
let envconfpath = path.join(__dirname, './.env');
require('dotenv').config({ path: envconfpath });

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

process.on('uncaughtException', function (err) { console.warn(err); });

global.bot = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
], partials: [Partials.Channel] });
global.bot.commands = new Collection();
global.color = '#' + config.bot.color;
global.botOwner = config.bot.owner;
global.version = pkg.version;
global.commands = [];

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    global.bot.commands.set(command.data.name, command);
    global.commands.push(command.data.toJSON());
}

global.bot.once('ready', () => {
    global.bot.user.setPresence({
        activities: [{
            name: 'v' + global.version,
            type: ActivityType.Streaming,
            url: 'https://www.twitch.tv/mistersircode'
        }],
        status: 'online'
    })
    console.log('\n\n');
    console.log(colors.bold('    █ ▄▀ █  █ █▀▄▀█ █▀▀█').magenta);
    console.log(colors.bold('    █▀▄  █  █ █ █ █ █▄▄█').magenta);
    console.log(colors.bold('    █  █ ▀▄▄▀ █   █ █  █').magenta);
    console.log(colors.bold(`    v${global.version}\n\n`).magenta);
    console.log(colors.bold(' + ').green + `Logged in as `.cyan + colors.bold(global.bot.user.tag).red + '\n');
});

let reloadCommands = new Promise(async (resolve, reject) => {
    try {
        let customCommands = global.commands.filter(comm => !comm["override"]);
        await rest.put(
            Routes.applicationCommands(global.bot.user.id),
            { body: customCommands },
        );
        console.log(customCommands);
        resolve();
    } catch (error) {
        console.error(error);
        resolve();
    }
});

let reloadLocalCommands = new Promise(async (resolve, reject) => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(global.bot.user.id, '731511745755217931'),
            { body: commands },
        );
        resolve();
    } catch (error) {
        console.error(error);
        resolve();
    }
});

global.bot.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    if (!global.bot.commands.has(interaction.commandName)) return;
    try {
        await global.bot.commands.get(interaction.commandName).execute(interaction);
    } catch (error) {
        if (interaction.user.id === config.bot.owner) {
            await interaction.reply({ content: `Error: ${error}`, ephemeral: true });
            console.log(error);
        }
    }
});

global.bot.on('messageCreate', message => { 
    const txt = message.content;
    if (message.author.id == config.bot.owner) {
        let botname = bot.user.username.toLowerCase();
        if (txt.startsWith(botname + ' end')) {
            console.log('Shutting Down...'.red);
            message.reply('Emergency Shutdown Started').then(process.exit);
        } else if (txt.startsWith(botname + ' restart')) {
            process.on('exit', function () {
                require('child_process').spawn(process.argv.shift(), process.argv, {
                    cwd: process.cwd(),
                    detached : true,
                    stdio: 'inherit'
                });
            });
            console.log('Restarting...'.red);
            message.reply('Emergency Restart Started').then(process.exit);
        } else if (txt.startsWith(botname + ' host')) {
            const logEmbed = new EmbedBuilder()
                .addFields({
                    name: 'Platform',
                    value: `${os.platform()} - ${os.release}`
                }, {
                    name: 'Host Type',
                    value: `${os.type()}`
                });
            message.channel.send({ embeds: [logEmbed] });
        } else if (txt.startsWith(botname + ' reload global')) {
            message.channel.send(`Reloading all global REST commands...`);
            reloadCommands.then(() => {
                message.channel.send('Global slash commands updated');
            });
        } else if (txt.startsWith(botname + ' reload local')) {
            message.channel.send(`Reloading all local REST commands...`);
            reloadLocalCommands.then(() => {
                message.channel.send('Local slash commands updated for this server');
            })
        } else if (txt.startsWith(botname + ' reload')) {
            const cmdName = txt.split(' ')[1];
            if(message.client.commands.get(cmdName)){
                const command = message.client.commands.get(cmdName) ||
                message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
                if (!command) return message.channel.send(`No command named \`${cmdName}\``);
                delete require.cache[require.resolve(`./commands/${cmdName}.js`)];
            }
            try {
                const newCommand = require(`./${cmdName}.js`);
                message.client.commands.set(cmdName, newCommand);
                message.channel.send(`Command ${cmdName} Reloaded`);
            } catch (error) {
                console.log(error);
            }
        }
    }
});

global.bot.login(process.env.TOKEN);
console.clear();