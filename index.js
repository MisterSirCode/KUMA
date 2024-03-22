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
global.locals = []

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    global.bot.commands.set(command.data.name, command);
    if (command.override) global.locals.push(command.data.toJSON());
    else  global.commands.push(command.data.toJSON());
}

function refreshPresence() {
    global.bot.user.setPresence({
        activities: [{
            name: 'v' + global.version,
            type: ActivityType.Streaming,
            url: 'https://www.twitch.tv/mistersircode'
        }],
        status: 'online'
    });
}

global.bot.once('ready', () => {
    console.log('\n\n');
    console.log(colors.bold('    █ ▄▀ █  █ █▀▄▀█ █▀▀█').magenta);
    console.log(colors.bold('    █▀▄  █  █ █ █ █ █▄▄█').magenta);
    console.log(colors.bold('    █  █ ▀▄▄▀ █   █ █  █').magenta);
    console.log(colors.bold(`    v${global.version}\n\n`).magenta);
    console.log(colors.bold(' + ').green + `Logged in as `.cyan + colors.bold(global.bot.user.tag).red + '\n');
    refreshPresence();
    setInterval(refreshPresence, 60000);
});

let resetCommands = new Promise(async (resolve, reject) => {
    try {
        await rest.put(Routes.applicationCommands(global.bot.user.id), { body: [] });
        await rest.put(Routes.applicationGuildCommands(global.bot.user.id, config.bot.mainserver), { body: [] });
        resolve();
    } catch (error) {
        console.error(error);
        resolve();
    }
});

let reloadCommands = new Promise(async (resolve, reject) => {
    try {
        let customCommands = global.commands;
        //await rest.put(Routes.applicationCommands(global.bot.user.id), { body: global.commands });
        await rest.put(Routes.applicationGuildCommands(global.bot.user.id, config.bot.mainserver), { body: global.locals });
        console.log(customCommands);
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
        } else if (txt.startsWith(botname + ' reload')) {
            message.channel.send(`Reloading REST commands...`);
            reloadCommands.then(() => {
                message.channel.send('Slash commands Updated');
            });
        } else if (txt.startsWith(botname + ' reset')) {
            message.channel.send(`Deleting REST commands...`);
            resetCommands.then(() => {
                message.channel.send(`Slash commands Deleted`);
            });
        } else if (txt.startsWith(botname + ' load')) {
            message.channel.send(`Attempting to reload command...`);
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