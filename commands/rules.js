const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const commandBuilder = new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Generate a Rules embed')
    .addStringOption((option) => option
        .setName('color')
        .setDescription('Color of the embed')
        .setRequired(false));

commandBuilder['EXFROMRULES'] = true;

module.exports = {
	data: commandBuilder,
	async execute(interaction) {
        const user = interaction.user;
        const profileEmbed = new EmbedBuilder()
            .setTitle('**The Server Rules**')
            .setDescription('***__We have three simple rules. Follow them__***\nI dont think I need to explain what will happen to you if you dont')
            .addFields({
                name: '**0 - Terms of Service**',
                value: 'Im not looking for server deletion.'
            }, {
                name: '**1 - Dont be a Piece of Crap**',
                value: 'This a simple rule that anyone should be able to abide by. Its not going to be enforced like a dictatorship, but you should still respect it regardless',
                inline: true
            }, {
                name: '**2 - Keep things Mature and SFW**',
                value: 'Again, another simple rule, avoid NSFW content. Suggestive jokes are okay. Also, act like an adult. This is discord, not roblox... Dont act like a damn kid',
                inline: true
            }, {
                name: '**3 - Respect the Humans and their Choices**',
                value: 'If you disagree with someone, be nice about it. If someone likes something and you dont, move on, its not your job to judge their choices',
                inline: true
            })
            .setColor(interaction.options.getString('color') || global.color)
            .setFooter({
                text: `Rules last updated: ${interaction.createdAt.toDateString()}`,
                iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
            });
        interaction.reply({ embeds: [profileEmbed] });
	},
};