const Discord = require("discord.js");

module.exports = {
    name: "invite",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        const inviteEmbed = new Discord.MessageEmbed()
            .setTitle("Click here to invite me to your server")
            .setColor(Color)
            .setURL("https://discord.com/api/oauth2/authorize?client_id=731617199877521508&permissions=879632&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3F%26client_id%3D731617199877521508%26scope%3Dbot&scope=bot");
        msg.channel.send(inviteEmbed);
    }
};