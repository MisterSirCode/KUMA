const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');

global.bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
global.bot.commands = new Collection();

const commands = [];
const commandFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	global.bot.commands.set(command.data.name, command);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(config.bot.token);

global.bot.once('ready', () => {
    console.log(`Logged in as ${global.bot.user.tag}!`);
    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');
    
            await rest.put(
                Routes.applicationGuildCommands(global.bot.user.id, '237835843677585408'),
                { body: commands },
            );
    
            console.log('Successfully reloaded application (/) commands.');
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
            await interaction.reply({ content: `error: ${error}`, ephemeral: true });
        }
	}
});

global.bot.on('messageCreate', message => {
    // if (message.content === 'arthurs prefix') {
    //     message.channel.send();
    // }
});

global.bot.login(config.bot.token);