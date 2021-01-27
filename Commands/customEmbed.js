function sendMessage() {
}
const Discord = require("discord.js");

module.exports = {
    name: "customEmbed",
    description: "",
    execute(msg, args, Bot, Color, Version, Prefix) {
        if (msg.author.id === "317796835265871873") {
            var request = new XMLHttpRequest();
            request.setRequestHeader('Content-type', 'application/json');
            if ("faq") {
                request.open("POST", "https://discordapp.com/api/webhooks/676118118082281513/ZS5YcWhurzokBrKX9NgexqtxrJA5Pu2Bo4i7_JsIxC-JIbPBVhSZkcVVukGOro52rnQA");
            }
        }
    }
};