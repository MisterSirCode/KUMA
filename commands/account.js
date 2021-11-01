const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Player = require('../mongo/player.js');

const commandBuilder = new SlashCommandBuilder()
    .setName('account')
    .setDescription('Create or update an account with arthur')
    .addUserOption((option) =>
    option.setName('user')
        .setDescription('(RANK 3 ONLY) - User you want to create an account for')
        .setRequired(false));

module.exports = {
	data: commandBuilder,
	async execute(interaction) {
        mongoose.connect('mongodb://localhost/data', { useNewUrlParser: true, useUnifiedTopology: true });
        const userOption = interaction.options.getUser('user');
        const user = userOption ? userOption : interaction.user;
        if (await Player.exists({ id: user.id })) {
            const logEmbed = new MessageEmbed()
                .setAuthor('Updated Account', `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
                .addField('Username', `${user.username}#${user.discriminator}`)
                .setColor(global.color);
            Player.updateOne({ id: user.id }, {
                name: user.username,
                descrim: user.discriminator,
                avatar: user.avatar,
                lastTime: interaction.createdAt
            }).then(() => interaction.reply({ embeds: [logEmbed] }))
                .catch(e => console.log(`(account.js) Updater Error: ${e}`));
        } else {
            const logEmbed = new MessageEmbed()
                .setAuthor('Created Account', `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
                .addField('Username', `${user.username}#${user.discriminator}`)
                .setColor(global.color);
            const newLog = new Player({
                _id: mongoose.Types.ObjectId(),
                id: user.id,
                name: user.username,
                descrim: user.discriminator,
                avatar: user.avatar,
                addedTime: interaction.createdAt,
                lastTime: interaction.createdAt,
                rank: 0,
                level: 0,
                exp: 0,
                contrib: false
            });
            newLog.save()
                .then(() => interaction.reply({ embeds: [logEmbed] }))
                .catch(e => console.log(`(account.js) Setter Error: ${e}`));
        }
	},
};