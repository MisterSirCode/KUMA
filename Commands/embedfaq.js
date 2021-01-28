const Discord = require("discord.js");
const webhookUrl = "https://discord.com/api/webhooks/803970662480871445/U9CJiGaT3DpXY35EWuHV2JuekbkEuZYXmg5naAolp47-Skvx0V4yENBicJCwhr0ozyum".split("/")
const hook = new Discord.WebhookClient(webhookUrl[5], webhookUrl[6]);

module.exports = {
    name: "embedfaq",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        if (msg.author.id === "317796835265871873") {
            const newArgs = args.split("|");
            const faqEmbed = new Discord.MessageEmbed()
                .setTitle(`${newArgs[0]}`)
                .setColor(Color)
                .setDescription(`${newArgs[1]}`);
            hook.send(faqEmbed);
            msg.delete();
        }
    }
};