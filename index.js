const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');
const colors = require('colors');

global.bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
global.bot.commands = new Collection();
global.color = `#${config.bot.color}`;
global.botOwner = config.bot.owner;
global.ranks = ['Member', 'Global Moderator', 'Global Administrator', 'Global Superuser'];
global.badges = ['', '<:GlobalBotMod:750528606924570745>',
    '<:GlobalBotAdmin:750528606996004964>',
    '<:GlobalBotSuperuser:750170311348977745>',
    '<:GlobalBotOwner:750527063752048661>',
    '<:Contributor:810843786707992577>',
    '<:DiscordNitro:747511562830610594>',
    '<:Boost:749992806357008504>'];

const commands = [];
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    global.bot.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(config.bot.token);

global.bot.once('ready', () => {
    console.log(`Logged in as ${global.bot.user.tag}!\n`.cyan);
    (async () => {
        try {
            console.log('Started refreshing application commands.'.yellow);

            await rest.put(
                Routes.applicationGuildCommands(global.bot.user.id, '237835843677585408'),
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

global.bot.on('messageCreate', message => { });

global.bot.login(config.bot.token);