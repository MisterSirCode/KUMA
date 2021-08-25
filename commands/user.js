const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Player = require('../mongo/player.js');

const commandBuilder = new SlashCommandBuilder()
    .setName('user')
    .setDescription('See your own or someone elses public account');
commandBuilder.addUserOption((option) =>
    option.setName('user')
        .setDescription('Account you want to view'));

module.exports = {
	data: commandBuilder,
	async execute(interaction) {
        mongoose.connect('mongodb://localhost/data', { useNewUrlParser: true, useUnifiedTopology: true });
        const user = interaction.options.getUser('user');
        if (user) {

        } else {
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
                interaction.reply("Invalid")
                    .then(() => interaction.deleteReply());
            }
        }
	},
};