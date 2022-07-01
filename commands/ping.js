const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping Arthur'),
	async execute(interaction) {
		const user = global.bot.user;
		const pingEmbed = new MessageEmbed()
			.setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
			.setDescription(`Process Identifier: ${process.pid}`)
			.addField('Ping', `${Math.abs(Date.now() - interaction.createdTimestamp)}ms ${Math.round(global.bot.ws.ping)}ams`)
			.setColor(global.color);
		await interaction.reply({ embeds: [pingEmbed], ephemeral: interaction.options.getInteger('hidden') == 1 ? true : false});
	},
};