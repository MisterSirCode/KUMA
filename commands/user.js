const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Player = require('../mongo/player.js');

const commandBuilder = new SlashCommandBuilder()
    .setName('user')
    .setDescription('See your own or someone elses public account')
    .addUserOption((option) =>
    option.setName('user')
        .setDescription('Account you want to view'));

module.exports = {
	data: commandBuilder,
	async execute(interaction) {
        mongoose.connect('mongodb://localhost/data', { useNewUrlParser: true, useUnifiedTopology: true });
        const user = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;
        if (await Player.exists({ id: user.id })) {
            const profileEmbed = new MessageEmbed()
                .setAuthor(`Profile of ${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
                .setColor(global.color);
            Player.findOne({ id: user.id }).then((data) => {
                profileEmbed.setDescription(`${user.username}#${user.discriminator}\n${global.badges[data.rank]}`)
                .addField(`Rank ${data.rank}`, `${global.ranks[data.rank]}`, true);
                interaction.reply({ embeds: [profileEmbed] });
            }).catch(e => console.log(`(user.js) Grabber Error: ${e}`));
        } else {
            const profileEmbed = new MessageEmbed()
                .setDescription(`No data exists for ${user.username}#${user.discriminator}!\nCreate one with /account to start!`)
                .setColor(global.color);
            interaction.reply({ embeds: [profileEmbed] });
        }
	},
};