const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Player = require('../mongo/player.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('account')
		.setDescription('Create or Update account with Arthur'),
	async execute(interaction) {
        mongoose.connect('mongodb://localhost/data', { useNewUrlParser: true, useUnifiedTopology: true });
        if (await Player.exists({ id: interaction.user.id })) {
            const logEmbed = new MessageEmbed()
                .setAuthor('Updated Account', `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)
                .addField('Username', `${interaction.user.username}#${interaction.user.discriminator}`)
                .setColor(global.color);
            Player.updateOne({ id: interaction.user.id }, {
                name: interaction.user.username,
                descrim: interaction.user.discriminator,
                avatar: interaction.user.avatar,
                lastTime: interaction.createdAt
            }).then(() => interaction.reply({ embeds: [logEmbed] }))
                .catch(e => console.log(`(account.js) Updater Error: ${e}`));
        } else {
            const logEmbed = new MessageEmbed()
                .setAuthor('Created Account', `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)
                .addField('Username', `${interaction.user.username}#${interaction.user.discriminator}`)
                .setColor(global.color);
            const newLog = new Player({
                _id: mongoose.Types.ObjectId(),
                id: interaction.user.id,
                name: interaction.user.username,
                descrim: interaction.user.discriminator,
                avatar: interaction.user.avatar,
                addedTime: interaction.createdAt,
                lastTime: interaction.createdAt,
                rank: 0
            });
            newLog.save()
                .then(() => interaction.reply({ embeds: [logEmbed] }))
                .catch(e => console.log(`(account.js) Setter Error: ${e}`));
        }
	},
};