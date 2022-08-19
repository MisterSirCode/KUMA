const { MessageEmbed, SlashCommandBuilder } = require('discord.js');

const commandBuilder = new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute user')
    .addUserOption((option) => option.setName('user')
        .setDescription('Account you want to Mute')
        .setRequired(true))
    .addStringOption((option) => option.setName('reason')
        .setDescription('Reason for the Mute')
        .setRequired(false));

module.exports = {
	data: commandBuilder,
	async execute(interaction) {
        const options = interaction.options;
        const specMem = options.getMember('user');
        const specUsr = options.getUser('user');
        const memb = specMem ? specMem : interaction.member;
        const user = specUsr ? specUsr : interaction.member;
        const muteEmbed = new MessageEmbed()
            .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
            .setColor(global.color)
            .addField('Muted for reason', `${options.getString('reason') ? options.getString('reason') : 'None'}`);
        if (user.id != global.botOwner) {
            interaction.guild.roles.fetch('992542568883703839').then((role) => {
                console.log(role);
                memb.roles.add(role);
                interaction.guild.publicUpdatesChannel.send({ embeds: [muteEmbed] });
                interaction.reply({ embeds: [muteEmbed] });
            });
        } else {
            interaction.reply('Silly! I cant mute my creator!');
        }
	},
};