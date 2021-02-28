function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
};

module.exports = {
    name: "purge",
    description: "",
	async execute(msg, args, Bot, Color, Version, Prefix) {
        if (typeof parseInt(args) == "number") {
            if (msg.member.hasPermission("MANAGE_MESSAGES")) {
                msg.channel.bulkDelete(clamp(parseInt(args) + 1, 0, 100));
            } else msg.channel.send(`You do not have permission to Delete Messages`);
        }
    }
};