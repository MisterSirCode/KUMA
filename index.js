const { Client, Collection, REST, GatewayIntentBits, 
        Partials, Routes, EmbedBuilder, ActivityType } = require('discord.js');
const config = require('./config.json');
const pkg = require('./package.json');
const colors = require('colors');
const os = require('os');
const path = require('path');
const { isArray } = require('util');
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
global.locals = [];
global.globals = [];

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    global.bot.commands.set(command.data.name, command);
    if (command.local) global.locals.push(command.data.toJSON());
    else  global.globals.push(command.data.toJSON());
    global.commands.push(command.data.toJSON())
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

function dmOwner(message) {
    global.bot.users.fetch(global.botOwner, false).then((user) => {
        user.send(message);
    });
}

function dayTimer(daysCompleted) {
    if (daysCompleted >= 25) {
        dmOwner('Reminder to ping me today!');
        dayTimer(0)
    } else {
        setTimeout(() => {
            dayTimer(daysCompleted + 1);
        }, 86400000); // 24 Hours
    }
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
    dayTimer(0);
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
        try {
            if (txt.startsWith('keval')) {
                const content = txt.split(' ');
                try {
                    content.shift();
                    const evalText = Array.isArray(content) ? content.join(' ') : content;
                    const out = eval('('+content+')')
                    message.reply(out ? out : 'Eval ran with no output');
                } catch(e) {
                    message.reply('Eval failed with error: ' + e);
                }
            } else if (txt.startsWith(botname + ' end')) {
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
                        value: `${os.platform()} - ${os.release()} / ${os.version()}`
                    }, {
                        name: 'Host Type',
                        value: `"${os.hostname()}" ${os.type()} - ${os.machine()} / ${os.arch()}`
                    }, {
                        name: 'CPU',
                        value: `${os.cpus()[0].model}`
                    });
                message.reply({ embeds: [logEmbed] });
            } else if (txt.startsWith(botname + ' reload')) {
                message.reply(`Reloading REST commands...`);
                rest.put(Routes.applicationCommands(global.bot.user.id), { body: global.globals }).then((e) => {
                    rest.put(Routes.applicationGuildCommands(global.bot.user.id, config.bot.mainserver), { body: global.locals }).then(() => {
                        message.channel.send((global.commands.length) + ' slash commands Updated');
                    });
                });
            } else if (txt.startsWith(botname + ' reset')) {
                message.reply(`Deleting REST commands...`);
                rest.put(Routes.applicationCommands(global.bot.user.id), { body: [] }).then(() => {
                    rest.put(Routes.applicationGuildCommands(global.bot.user.id, config.bot.mainserver), { body: [] }).then(() => {
                        message.channel.send((global.commands.length) + ' slash commands Deleted');
                    });
                });
            } else if (txt.startsWith(botname + ' load')) { // Unfinished
                message.reply(`Attempting to reload command...`);
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
        } catch(e) {
            message.reply('Failed with error: ' + e);
        }
    }
});

global.bot.login(process.env.TOKEN);
console.clear();