const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Interaction } = require('discord.js');
const mongoose = require('mongoose');
const Player = require('../mongo/player.js');

const commandBuilder = new SlashCommandBuilder()
    .setName('setrank')
    .setDescription('(RANK 3 ONLY) - Set an accounts rank')
    .addUserOption((option) =>
    option.setName('user')
        .setDescription('Account you want to edit')
        .setRequired(true))
    .addIntegerOption((option) =>
    option.setName('rank')
        .setDescription('Rank you want to set')
        .addChoices([
            ['Member', 0],
            ['Global Moderator', 1],
            ['Global Administrator', 2],
            ['Global Superuser', 3]
        ])
        .setRequired(true));

module.exports = {
	data: commandBuilder,
	async execute(interaction) {
        mongoose.connect('mongodb://localhost/data', { useNewUrlParser: true, useUnifiedTopology: true });
        if (await Player.exists({ id: interaction.user.id }) || interaction.user.id == global.botOwner) {
            const executor = await Player.findOne({ id: interaction.user.id });
            if (executor.rank >= 3 || interaction.user.id == global.botOwner) {
                const user = interaction.options.getUser('user');
                const rank = interaction.options.getInteger('rank');
                const rankEmbed = new MessageEmbed()
                    .setAuthor('Updated Player Rank', `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
                    .setDescription(`${user.username}#${user.discriminator} is now rank ${rank}`)
                    .setColor(global.color);
                Player.updateOne({ id: user.id }, { rank: rank })
                    .then(() => interaction.reply({ embeds: [rankEmbed] }))
                    .catch(e => console.log(`(setrank.js) Updater Error: ${e}`));
            } else {
                interaction.reply("Not Allowed")
                    .then(() => interaction.deleteReply());
            }
        } else  {
            interaction.reply("Invalid")
                .then(() => interaction.deleteReply());
        }
	},
};