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
            if (await Player.exists({ id: user.id })) {
                const profileEmbed = new MessageEmbed()
                    .setAuthor('Your Pofile', `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
                    .setDescription(`${user.username}#${user.discriminator}`)
                    .setColor(global.color);
                Player.findOne({ id: user.id }).then((data) => {
                    profileEmbed.addField(`Rank ${data.rank}`, `${global.ranks[data.rank]}`, true);
                    interaction.reply({ embeds: [profileEmbed] });
                }).catch(e => console.log(`(user.js) Grabber Error: ${e}`));
            } else {
                const profileEmbed = new MessageEmbed()
                    .setDescription(`${user.username}#${user.discriminator} does not have an account!\nTheyll need to create one with /account to start!`)
                    .setColor(global.color);
                interaction.reply({ embeds: [profileEmbed] });
            }
        } else {
            if (await Player.exists({ id: interaction.user.id })) {
                const profileEmbed = new MessageEmbed()
                    .setAuthor('Your Pofile', `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)
                    .setDescription(`${interaction.user.username}#${interaction.user.discriminator}`)
                    .setColor(global.color);
                Player.findOne({ id: interaction.user.id }).then((data) => {
                    profileEmbed.addField(`Rank ${data.rank}`, `${global.ranks[data.rank]}`, true);
                    interaction.reply({ embeds: [profileEmbed] });
                }).catch(e => console.log(`(user.js) Grabber Error: ${e}`));
            } else {
                const profileEmbed = new MessageEmbed()
                    .setDescription(`${interaction.user.username}#${interaction.user.discriminator}, you do not have an account!\nCreate one with /account to start!`)
                    .setColor(global.color);
                interaction.reply({ embeds: [profileEmbed] });
            }
        }
	},
};