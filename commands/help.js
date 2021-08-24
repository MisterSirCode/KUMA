const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get some help'),
	async execute(interaction) {
        const helpEmbed = new MessageEmbed()
            .setTitle('Arthur\'s Commands')
            .addField('/help', 'Get some help', true)
            .addField('/ping', 'Ping Arthur', true);
		await interaction.reply({ embeds: [helpEmbed] });
	},
};