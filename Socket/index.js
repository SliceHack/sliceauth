const { Server } = require('socket.io');

module.exports = (server) => {
    const io = new Server(server);

    const usernames = [];

    io.on('connection', (socket) => {
        var discordName;
        var username;

        socket.on("connected", (...args) => {
            discordName = args[0];
            username = args[1];
            hardwareID = args[2];

            const db = new JSONdb('accounts.json');
            var auth = false;
            
            if (db.has(hwid)) {
                auth = true;
            }

            if(!auth) {
                socket.disconnect();
                return;
            }

            usernames.push(username + ":" + discordName);
            io.emit("usernameSet", usernames)
            io.emit("ircConnection", discordName, username);
        })

        socket.on('setUsername', (...args) => {
            username = args[0];
            var lastusername = args[1];

            //remove lastusername from the array of usernames if it exists and add the new username
            if (lastusername) {
                var index = usernames.indexOf(lastusername + ":" + discordName);
                if (index > -1) {
                    usernames.splice(index, 1);
                }
            }
            usernames.push(username + ":" + discordName);
            io.emit("usernameSet", JSON.stringify(usernames));
        });

        socket.on("message", (...args) => {
            var message = args[0];

            if(discordName == undefined) {
                socket.disconnect();
                return;
            }

            io.emit("newMessage", discordName, message, username);
        })

        socket.on("disconnect", () => {
            //remove username from the array of usernames
            var index = usernames.indexOf(username + ":" + discordName);
            if (index > -1) {
                usernames.splice(index, 1);
            }
            io.emit("ircDisconnection", discordName, username);
            io.emit("usernameSet", usernames);
        })

        socket.on('keepAlive', () => {});

        setInterval(() => {
            socket.emit('keepAlive', 'keepAlive');
        }, 2000);
    });
}