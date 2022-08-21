const { Client, Collection, REST, GatewayIntentBits, Partials, Routes, EmbedBuilder } = require('discord.js');
const config = require('./config.json');
const pkg = require('./package.json');
const inquirer = require('inquirer');
const colors = require('colors');
const fs = require('fs');
const os = require('os')
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
require('dotenv').config();

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
    console.log('\n\n');
    console.log(colors.bold('   ▒█░▄▀ ▒█░▒█ ▒█▀▄▀█ ░█▀▀█').magenta);
    console.log(colors.bold('   ▒█▀▄░ ▒█░▒█ ▒█▒█▒█ ▒█▄▄█').magenta);
    console.log(colors.bold('   ▒█░▒█ ░▀▄▄▀ ▒█░░▒█ ▒█░▒█').magenta);
    console.log(colors.bold(`   v${global.version}\n\n`).magenta);
    console.log(colors.bold(' + ').green + `Logged in as `.cyan + colors.bold(global.bot.user.tag).red + '\n');
});

async function reloadCommands() {
    try {
        console.log(colors.bold(' = ').yellow + 'Started Reloading Commands'.yellow);
        await rest.put(
            Routes.applicationCommands(global.bot.user.id),
            { body: commands },
        );
        console.log(colors.bold(' + ').green + 'Successfully Reloaded Commands\n\n'.green);
    } catch (error) {
        console.error(error);
    }
}

async function reloadLocalCommands() {
    try {
        console.log(colors.bold(' = ').yellow + 'Started Reloading Commands'.yellow);
        await rest.put(
            Routes.applicationGuildCommands(global.bot.user.id, '731511745755217931'),
            { body: commands },
        );
        console.log(colors.bold(' + ').green + 'Successfully Reloaded Commands\n\n'.green);
    } catch (error) {
        console.error(error);
    }
}

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
        let name = bot.user.username.toLowerCase();
        if (txt.startsWith(name + ' shutdown')) {
            console.log('Shutting Down...'.red);
            message.reply('Emergency Shutdown Started').then(process.exit);
        } else if (txt.startsWith(name + ' restart')) {
            process.on('exit', function () {
                require('child_process').spawn(process.argv.shift(), process.argv, {
                    cwd: process.cwd(),
                    detached : true,
                    stdio: 'inherit'
                });
            });
            console.log('Restarting...'.red);
            message.reply('Emergency Restart Started').then(process.exit);
        } else if (txt.startsWith(name + ' reload')) {
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
                message.reply({ content: `Error: ${error}`, ephemeral: true })
            }
        } else if (txt.startsWith(name + ' os_host')) {
            const logEmbed = new EmbedBuilder()
                .addFields({
                    name: 'Platform',
                    value: `${os.platform()} - ${os.release}`
                }, {
                    name: 'Host Type',
                    value: `${os.type()}`
                });
            message.channel.send({ embeds: [logEmbed] });
        } else if (txt.startsWith(name + ' reload_REST')) {
            (async function() {
                message.channel.send(`Reloading all global REST commands...`);
                await reloadCommands();
                message.channel.send('Global slash commands updated');
            })();
        } else if (txt.startsWith(name + ' reload_REST_local')) {
            (async function() {
                message.channel.send(`Reloading all local REST commands...`);
                await reloadLocalCommands();
                message.channel.send('Local slash commands updated for this server');
            })();
        }
    }
});

global.bot.login(process.env.TOKEN);
console.clear();