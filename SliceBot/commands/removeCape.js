module.exports = {
    name: 'removecape',

    async execute(client, message, args) {
        const author = message.author;
        const id = author.id;

        if(!fs.existsSync(`./public/capes/${id}.png`)) {
            return message.reply("You don't have a cape to remove!");
        }

        fs.unlinkSync(`./public/capes/${id}.png`);
        return message.reply("Your cape has been removed!");
    },
};