const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    local: false,
	data: new SlashCommandBuilder()
        .setName('guild')
        .setDescription(`See this guild's common information`),
	async execute(interaction) {
        const guild = interaction.guild;
        const profileEmbed = new EmbedBuilder()
            .setAuthor({
                name: guild.name, 
                iconURL: guild.iconURL()
            })
            .setDescription(`${guild.id}`)
            .addFields({
                name: `Members`,
                value: `${guild.memberCount}`
            }, {
                name: `Created On`,
                value: `${guild.createdAt}`
            })
            .setColor(global.color);
        if (guild.description) profileEmbed.setDescription(`${guild.id}\n\n${guild.description}`)
        interaction.reply({ embeds: [profileEmbed] });
	},
};