const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const commandBuilder = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('(Guild Moderator) Ban user from your guild')
    .addMUserOption((option) => 
        option.setName('user')
        .setDescription('User to ban')
        .setRequired(true));

module.exports = {
	data: commandBuilder,
	async execute(interaction) {
        if (!interaction.inGuild()) {
            const failEmbed = new MessageEmbed()
                .setTitle(`You cant ban a user outside a guild`)
                .setColor(global.color);
            await interaction.reply({ embeds: [failEmbed], ephemeral: true });
            return;
        }
        if (interaction.user.member.permissions.has('BAN_MEMBERS')) {
            const userOption = interaction.options.getUser('user');
            const member = interaction.guild.members.fetch(userOption);
            if (member.bannable) {
                member.ban()
                .then(() => {
                    const banEmbed = new MessageEmbed()
                        .setAuthor(`${userOption.username}#${userOption.descriminator}`, `https://cdn.discordapp.com/avatars/${userOption.id}/${userOption.avatar}.png`)
                        .setTitle(`${userOption.username} was banned from the server`)
                        .setColor(global.color);
                    await interaction.reply({ embeds: [banEmbed], ephemeral: true });
                    return;
                })
                .catch((e) => interaction.reply({ content: `Ban failed with error, ${e}`, ephemeral: true}));
            }
        }
	},
};