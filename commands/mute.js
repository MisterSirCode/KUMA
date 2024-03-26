const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    local: true,
	data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute user')
        .addUserOption((option) => option.setName('user')
            .setDescription('Account you want to Mute')
            .setRequired(true))
        .addStringOption((option) => option.setName('reason')
            .setDescription('Reason for the Mute')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	async execute(interaction) {
        const options = interaction.options;
        const specMem = options.getMember('user');
        const specUsr = options.getUser('user');
        const memb = specMem ? specMem : interaction.member;
        const user = specUsr ? specUsr : interaction.member;
        const muteEmbed = new EmbedBuilder()
            .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
            })
            .addFields({
                name: 'Muted for reason',
                value: `${options.getString('reason') ? options.getString('reason') : 'None'}`
            })
            .setColor(global.color);
        if (user.id != global.botOwner) {
            interaction.guild.roles.fetch('992542568883703839').then((role) => {
                memb.roles.add(role);
                interaction.guild.publicUpdatesChannel.send({ embeds: [muteEmbed] });
                interaction.reply({ embeds: [muteEmbed] });
            });
        } else interaction.reply('Silly.. I cant mute the owner');
	},
};