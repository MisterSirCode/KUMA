const Discord = require("discord.js");
const ytdl = require('ytdl-core');

module.exports = {
    name: "audio",
    description: "",
	execute(msg, args, Bot, Color, Version, Prefix) {
        if (msg.author.id === "317796835265871873") {
            try {
                Bot.channels.fetch(args[0])
                    .then(channel => {
                        if (channel.type == "voice") {
                            channel.join().then(connection => {
                                connection.play(ytdl('https://www.youtube.com/watch?v=ZlAU_w7-Xp8', { quality: 'highestaudio' }));
                            });
                        }
                    });
            } catch(e) {}
        }
    },
    init(Bot, Color, Version) {

    }
};