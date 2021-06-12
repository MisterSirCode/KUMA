const Discord = require("discord.js");
const ytdl = require('ytdl-core');

module.exports = {
    name: "audio",
    description: "",
	execute(msg, args, Bot, Color, Version, Prefix) {
        if (msg.author.id === "317796835265871873") {
            try {
                const voice = msg.member.voice.channel;
                voice.join().then(connection => {
                    console.log("working");
                    const dispatcher = connection.play(
                        ytdl('https://www.youtube.com/watch?v=ZlAU_w7-Xp8', { quality: 'highestaudio', filter : 'audioonly' }),
                        { seek: 0, volume: 1 }
                    );
                    dispatcher.on("end", end => {
                        voice.leave();
                    });
                });
            } catch(e) {
                console.log(e);
            }
        }
    },
    init(Bot, Color, Version) {

    }
};