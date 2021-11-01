const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const commandBuilder = new SlashCommandBuilder()
    .setName('user')
    .setDescription('See user information privately')
    .addUserOption((option) => option.setName('user')
        .setDescription('Account you want to view')
        .setRequired(true))
    .addIntegerOption((option) => option.setName('hidden')
        .setDescription(`If you want the output hidden or not`)
        .addChoices([
            ['No', 0],
            ['Yes', 1],
    ]));

module.exports = {
	data: commandBuilder,
	async execute(interaction) {
        const user = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;
        const member = await interaction.guild.members.fetch(user.id);
        const profileEmbed = new MessageEmbed()
            .setAuthor(`Information for ${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
            .setDescription(`Created ${user.createdAt}`)
            .setFooter(`Joined ${member.joinedAt}`, `${interaction.guild.iconURL()}`)
            .setColor(global.color);
        interaction.reply({ embeds: [profileEmbed], ephemeral: interaction.options.getInteger('hidden') == 1 ? true : false});
	},
};