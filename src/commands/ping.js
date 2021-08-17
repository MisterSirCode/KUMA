const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping Android Arthur'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};