const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get some help'),
	async execute(interaction) {
        const helpEmbed = new MessageEmbed()
            .setTitle('Arthur\'s Commands');
			const commands = global.bot.commands;
			console.log(Object.keys(commands));
			Object.keys(commands).forEach((key) => {
				const command = commands[key];
				helpEmbed.addField('/' + command.data.name, command.data.description)
			});
		await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
	},
};