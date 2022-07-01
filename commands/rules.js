const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const commandBuilder = new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Generate a Rules embed')
    .addStringOption((option) => option
        .setName('color')
        .setDescription('Color of the embed')
        .setRequired(false));

module.exports = {
	data: commandBuilder,
	async execute(interaction) {
        const profileEmbed = new MessageEmbed()
            .setColor(interaction.options.getString('Color') || global.color)
            .addField('***Dont be a Piece of Crap***', 'This a simple rule that anyone should be able to abide by. Its not going to be enforced like a dictatorship, but you should still respect it regardless...', true)
            // .addField('')
            .setFooter(`Rules last updated: ${interaction.createdAt.toDateString()}`);
        interaction.reply({ embeds: [profileEmbed] });
	},
};