const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    local: false,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping the bot'),
	async execute(interaction) {
		const user = global.bot.user;
		const pingEmbed = new EmbedBuilder()
			.setAuthor({ 
				name: `${user.username}#${user.discriminator}`, 
				iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
			})
			.setDescription(`Process Identifier: ${process.pid}`)
			.addFields({
				name: 'Ping',
				value: `${Math.round(Math.abs((Date.now() - interaction.createdTimestamp)) / 100.0)}ms ${Math.round(global.bot.ws.ping)}ams`
			}, {
				name: 'Version',
				value: `${global.version}`
			})
			.setColor(global.color);
		await interaction.reply({ embeds: [pingEmbed], ephemeral: interaction.options.getInteger('hidden') == 1 ? true : false});
	},
};