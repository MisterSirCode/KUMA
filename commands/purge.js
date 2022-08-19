const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Mass Delete Messages')
        .addIntegerOption(option => 
            option.setName('number')
                .setDescription('Number of messages to purge. Between 2 to 100')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('quiet')
                .setDescription('Whether to announce it or not. Default is No')
                .setRequired(false)),
	async execute(interaction) {
        let count = Math.min(Math.max(interaction.options.getInteger('number'), 2), 100);
            interaction.channel.bulkDelete(count).then(() => {interaction.reply({ content: `Successfully Deleted ${count} Messages`, ephemeral: (interaction.options.getBoolean('quiet') || false) });
        }).catch(e => {});
	},
};