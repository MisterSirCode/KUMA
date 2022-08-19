const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const commandBuilder = new SlashCommandBuilder()
    .setName('kick')
    .setDescription('(Guild Moderator) Kick user from your guild')
    .addUserOption((option) => 
        option.setName('user')
        .setDescription('User to kick')
        .setRequired(true));

module.exports = {
	data: commandBuilder,
	async execute(interaction) {
        if (!interaction.inGuild())
            interaction.reply('You cant kick that person. Sorry');
        if (interaction.user.member.permissions.has('KICK_MEMBERS')) {
            const userOption = interaction.options.getUser('user');
            const member = interaction.guild.members.fetch(userOption);
            if (member.kickable) {
                member.kick()
                .then(() => {
                    const kickEmbed = new EmbedBuilder()
                        .setTitle(`${userOption.username} was kicked from the server`)
                        .setAuthor({
                            name: `${userOption.username}#${userOption.discriminator}`,
                            iconURL: `https://cdn.discordapp.com/avatars/${userOption.id}/${userOption.avatar}.png`
                        })
                        .setColor(global.color);
                    interaction.reply({ embeds: [kickEmbed], ephemeral: true });
                }).catch((e) => interaction.reply({ content: `Kick failed with error, ${e}`, ephemeral: true}));
            }
        }
	},
};