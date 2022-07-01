const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const commandBuilder = new SlashCommandBuilder()
    .setName('user')
    .setDescription('See your own or someone elses arthur profile')
    .addUserOption((option) => option.setName('user')
        .setDescription('Account you want to view')
        .setRequired(true));

module.exports = {
	data: commandBuilder,
	async execute(interaction) {
        const specUsr = interaction.options.getUser('user');
        const specMem = interaction.options.getMember('user');

        const user = specUsr ? specUsr : interaction.user;
        const memb = specMem ? specMem : interaction.member;

        const cret = user.createdAt;
        const join = memb.joinedAt;
        const profileEmbed = new MessageEmbed()
            .setAuthor(`Profile of ${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
            .setColor(global.color)
            .addField('Creation Date', `${cret.toDateString()}, ${(new Date(Date.now())).getYear() - cret.getYear()} years ago`)
            .addField('Local Join Date', `${join.toDateString()}, ${(new Date(Date.now())).getYear() - join.getYear()} years ago`);
        interaction.reply({ embeds: [profileEmbed] });
	},
};