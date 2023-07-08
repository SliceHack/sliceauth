const { Server } = require('socket.io');

const JSONdb = require('simple-json-db');

module.exports = (server) => {
    const io = new Server(server);

    const usernames = [];

    io.on('connection', (socket) => {
        var discordName = "Unknown", discordId = 0;
        var admin = false;
        var username = "Anonymous";

        socket.on("connected", (...args) => {
            discordName = args[0];
            username = args[1];
            discordId = args[3];
            admin = discordId == 853392200078983182
            || discordId == 381914174407835660;
            
            var db = new JSONdb('accounts.json');
            var auth = false;
            
            if(db.has(discordId)) {
                auth = true;
            }

            if(!auth) {
                socket.disconnect();
                return;
            }

            usernames.push(username + ":" + discordName + ":" + discordId);

            io.emit("usernameSet", usernames)
            io.emit("ircConnection", discordName, username, discordId);
        })

        socket.on('setUsername', (...args) => {
            username = args[0];
            var lastusername = args[1];
            var discordName = args[2];
            var discordId = args[3];

            //remove lastusername from the array of usernames if it exists and add the new username
            if (lastusername) {
                var index = usernames.indexOf(lastusername + ":" + discordName + ":" + discordId);
                if (index > -1) {
                    usernames.splice(index, 1);
                }
            }
            usernames.push(username + ":" + discordName + ":" + discordId);
            io.emit("usernameSet", JSON.stringify(usernames));
        });

        socket.on("message", (...args) => {
            var message = args[0];

            var check = message.replace(/\s+/g, '');
            if (check.length <= 0) {
                return;
            }

            if((discordName == "Unknown" || username == "Anonymous") || discordId == 0) {
                socket.emit('connected', discordName, username);
                return;
            }
            io.emit("newMessage", discordName, message, username);
        })

        socket.on('broadcast', (...args) => {
            var message = args[0];

            if (admin) {
                io.emit("addMessage", message);
            }
        })

        socket.on("disconnect", () => {
            var index = usernames.indexOf(username + ":" + discordName + ":" + discordId);
            if (index > -1) {
                usernames.splice(index, 1);
            }
            io.emit("ircDisconnection", discordName, username, discordId);
            io.emit("usernameSet", usernames);
        })

        socket.on('keepAlive', () => {});

        setInterval(() => {
            socket.emit('keepAlive', 'keepAlive');
        }, 2000);
    });
}