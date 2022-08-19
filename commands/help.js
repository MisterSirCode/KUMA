const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get some help'),
	async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setTitle(`${global.bot.user.username}\'s Commands`)
			.setColor(global.color);
			global.commands.forEach((command) => {
				if (command.EXFROMRULES) return;
				helpEmbed.addFields({
					name: '/' + command.name, 
					value: command.description, 
					inline: true
				});
			});
		await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
	},
};