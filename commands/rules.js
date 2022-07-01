const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const commandBuilder = new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Generate a Rules embed')
    .addStringOption((option) => option
        .setName('color')
        .setDescription('Color of the embed')
        .setRequired(false));

module.exports = {
	data: commandBuilder,
	async execute(interaction) {
        const profileEmbed = new MessageEmbed()
            .setColor(interaction.options.getString('color') || global.color)
            .addField('***__We have three simple rules. Follow them__***', 'I dont think I need to explain what I will do. Bans arent something new.')
            .addField('**0 - Terms of Service**', 'Im not looking for server deletion.')
            .addField('**1 - Dont be a Piece of Crap**', 
                'This a simple rule that anyone should be able to abide by. Its not going to be enforced like a dictatorship, but you should still respect it regardless', true)
            .addField('**2 - Keep things Mature and SFW**',
                'Again, another simple rule, avoid NSFW content. Suggestive jokes are okay. Also, act like an adult. This is discord, not roblox... Dont act like a damn kid', true)
            .addField('**3 - Respect the Humans and their Choices**',
                'If you disagree with someone, be nice about it. If someone likes something and you dont, move on, its not your job to judge their choices', true)
            // .addField('')
            .setFooter(`Rules last updated: ${interaction.createdAt.toDateString()}`);
        interaction.reply({ embeds: [profileEmbed] });
	},
};