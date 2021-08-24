const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Player = require('../mongo/player.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Log User Info'),
	async execute(interaction) {
        mongoose.connect('mongodb://localhost/data', { useNewUrlParser: true, useUnifiedTopology: true });
        if (Player.exists({ id: interaction.user.id })) {
            const logEmbed = new MessageEmbed()
                .setTitle('Updated Player Info');
                Player.updateOne({ id: interaction.user.id }, {
                    name: interaction.user.name,
                    avatar: interaction.user.avatar,
                    lastTime: interaction.createdAt
                }).then(interaction.reply({embeds: [logEmbed], ephemeral: true }))
                .catch(e => console.log(`(use.js) Updater Error: ${e}`));
        } else {
            const logEmbed = new MessageEmbed()
                .setTitle('Added Player Info');
            const newLog = new Player({
                _id: mongoose.Types.ObjectId(),
                id: interaction.user.id,
                name: interaction.user.name,
                avatar: interaction.user.avatar,
                addedTime: interaction.createdAt,
                lastTime: interaction.createdAt,
                rank: 0
            });
            newLog.save()
                .then(interaction.reply({embeds: [logEmbed], ephemeral: true }))
                .catch(e => console.log(`(use.js) Setter Error: ${e}`));
        }
	},
};