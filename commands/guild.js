const { MessageEmbed, SlashCommandBuilder } = require('discord.js');

const commandBuilder = new SlashCommandBuilder()
    .setName('guild')
    .setDescription(`See this guild's common information`);

module.exports = {
	data: commandBuilder,
	async execute(interaction) {
        const guild = interaction.guild;
        const profileEmbed = new MessageEmbed()
            .setAuthor(`${guild.name}`, `${guild.iconURL()}`)
            .setDescription(`${guild.id}`)
            .addField(`Members`, `${guild.memberCount}`)
            .addField(`Created On`, `${guild.createdAt}`)
            .setColor(global.color);
        if (guild.description) profileEmbed.setDescription(`${guild.id}\n\n${guild.description}`)
        interaction.reply({ embeds: [profileEmbed] });
	},
};