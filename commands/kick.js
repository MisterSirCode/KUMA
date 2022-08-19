const { MessageEmbed, SlashCommandBuilder } = require('discord.js');

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
        if (!interaction.inGuild()) {
            const failEmbed = new MessageEmbed()
                .setTitle(`You cant kick a user outside a guild`)
                .setColor(global.color);
            interaction.reply({ embeds: [failEmbed], ephemeral: true });
            return;
        }
        if (interaction.user.member.permissions.has('KICK_MEMBERS')) {
            const userOption = interaction.options.getUser('user');
            const member = interaction.guild.members.fetch(userOption);
            if (member.kickable) {
                member.kick()
                .then(() => {
                    const kickEmbed = new MessageEmbed()
                        .setAuthor(`${userOption.username}#${userOption.descriminator}`, `https://cdn.discordapp.com/avatars/${userOption.id}/${userOption.avatar}.png`)
                        .setTitle(`${userOption.username} was kicked from the server`)
                        .setColor(global.color);
                    interaction.reply({ embeds: [kickEmbed], ephemeral: true });
                    return;
                })
                .catch((e) => interaction.reply({ content: `Kick failed with error, ${e}`, ephemeral: true}));
            }
        }
	},
};