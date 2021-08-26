const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping Arthur'),
	async execute(interaction) {
		const pingEmbed = new MessageEmbed()
			.setAuthor(`${global.bot.user.username}#${global.bot.user.descriminator}`, `https://cdn.discordapp.com/avatars/${global.bot.user.id}/${global.bot.user.avatar}.png`)
			.addField('Guilds', `${global.bot.guilds.cache.size}`)
			.addField('Ping', `${Date.now() - interaction.createdTimestamp}ms`)
			.addField('API Ping', `${Math.round(global.bot.ws.ping)}ms`)
			.setColor(global.color);
		await interaction.reply({ embeds: [pingEmbed], ephemeral: true });
	},
};