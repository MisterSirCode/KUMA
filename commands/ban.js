const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    local: false,
	data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('(Guild Moderator) Ban user from your guild')
        .addUserOption((option) => 
            option.setName('user')
            .setDescription('User to ban')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
        if (!interaction.inGuild())
            interaction.reply('You cant ban that person. Sorry');
        if (interaction.user.member.permissions.has('BAN_MEMBERS')) {
            const userOption = interaction.options.getUser('user');
            const member = interaction.guild.members.fetch(userOption);
            if (member.bannable) {
                member.ban()
                .then(() => {
                    const banEmbed = new EmbedBuilder()
                    .setTitle(`${userOption.username} was banned from the server`)
                    .setAuthor({
                        name: `${userOption.username}#${userOption.discriminator}`,
                        iconURL: `https://cdn.discordapp.com/avatars/${userOption.id}/${userOption.avatar}.png`
                    })
                    .setColor(global.color);
                    interaction.reply({ embeds: [banEmbed], ephemeral: true });
                })
                .catch((e) => interaction.reply({ content: `Ban failed with error, ${e}`, ephemeral: true}));
            }
        }
	},
};