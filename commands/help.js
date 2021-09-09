const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get some help'),
	async execute(interaction) {
        const helpEmbed = new MessageEmbed()
            .setTitle('Arthur\'s Commands');
			global.commands.forEach((command) => {
				helpEmbed.addField('/' + command.name, command.description, true)
			});
		await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
	},
};