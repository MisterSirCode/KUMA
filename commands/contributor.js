const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Player = require('../mongo/player.js');

const commandBuilder = new SlashCommandBuilder()
    .setName('contributor')
    .setDescription('(RANK 3 ONLY) - Set an accounts contributor status')
    .addUserOption((option) =>
    option.setName('user')
        .setDescription('Account you want to edit')
        .setRequired(true))
    .addIntegerOption((option) =>
    option.setName('rank')
        .setDescription('Rank to set')
        .addChoices([
            ['Member', 0],
            ['Contributor', 1],
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
                    .setAuthor('Updated Player Rank', `https://cdn.discordapp.com/avatars/${user.id }/${user.avatar}.png`)
                    .setColor(global.color);
                if (rank == 0) rankEmbed.setDescription(`${user.username}#${user.discriminator} is no longer a contributor`)
                else rankEmbed.setDescription(`${user.username}#${user.discriminator} is now a contributor`)
                Player.updateOne({ id: user.id }, { contrib: rank == 0 ? false : true })
                    .then(() => interaction.reply({ embeds: [rankEmbed] }))
                    .catch(e => console.log(`(contributor.js) Updater Error: ${e}`));
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