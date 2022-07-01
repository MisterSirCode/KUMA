const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');
const colors = require('colors');
const { measureMemory } = require('vm');

global.bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
global.bot.commands = new Collection();
global.color = `#${config.bot.color}`;
global.botOwner = config.bot.owner;

global.commands = [];
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    global.bot.commands.set(command.data.name, command);
    global.commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(config.bot.token);

global.bot.once('ready', () => {
    console.log(`Logged in as ${global.bot.user.tag}!\n`.cyan);
    (async () => {
        try {
            console.log('Started refreshing application commands.'.yellow);

            await rest.put(
                Routes.applicationGuildCommands(global.bot.user.id, '731511745755217931'),
                //Routes.applicationCommands(global.bot.user.id),
                { body: commands },
            );

            console.log('Successfully reloaded application commands.'.green);
        } catch (error) {
            console.error(error);
        }
    })();
});

global.bot.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    if (!global.bot.commands.has(interaction.commandName)) return;
    try {
        await global.bot.commands.get(interaction.commandName).execute(interaction);
    } catch (error) {
        if (interaction.user.id === config.bot.owner) {
            await interaction.reply({ content: `Error: ${error}`, ephemeral: true });
        }
    }
});

global.bot.on('messageCreate', message => { 
    const txt = message.content;
    if (message.author.id == config.bot.owner) {
        if (txt == 'codur.shutdown') {
            console.log('Shutting Down...'.red);
            message.reply('Emergency Shutdown Started').then(process.exit);
        } else if (txt == 'codur.restart') {
            process.on("exit", function () {
                require("child_process").spawn(process.argv.shift(), process.argv, {
                    cwd: process.cwd(),
                    detached : true,
                    stdio: "inherit"
                });
            });
            console.log('Restarting...'.red);
            message.reply('Emergency Restart Started').then(process.exit);
        } else if (txt.startsWith('coder.reload')) {
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
        }
    }
});

global.bot.login(config.bot.token);