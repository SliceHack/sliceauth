const fs = require('fs')

module.exports = {
    name: 'viewcape',

    async execute(client, message, args) {
        const author = message.author;
        const id = author.id;

        if(!fs.existsSync(`./public/capes/${id}.png`)) {
            return message.reply({ files: ["./public/capes/slice/default.png"] });
        }

        return message.reply({ files: [`./public/capes/${id}.png`] });

    },
};