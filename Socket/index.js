const { Server } = require('socket.io');

module.exports = (server) => {
    const io = new Server(server);

    const sockets = [];
    const usernames = [];

    io.on('connection', (socket) => {
        var discordName;
        var username;
        socket.on("connected", (...args) => {
            discordName = args[0];
            username = args[1];
            sockets.push({
                socket,
                discordName,
                username,
            })
            usernames.push(username + ":" + discordName);
            io.emit("usernameSet", usernames)
            io.emit("ircConnection", discordName, username);
        })

        socket.on('setUsername', (...args) => {
            var username = args[0];
            var lastUsername = args[1];

            usernames.splice(usernames.indexOf(lastUsername + ":" + discordName), 1);
            usernames.push(username + ":" + discordName);
        });

        socket.on('onChat', (...args) => {
            socket.emit("users", args[0], usernames);
        })

        socket.on("message", (...args) => {
            var message = args[0];

            if(discordName == undefined) {
                socket.disconnect();
                return;
            }

            io.emit("newMessage", discordName, message, username);
        })

        socket.on("disconnect", () => {
            usernames.splice(usernames.indexOf(username + ":" + discordName), 1);
            io.emit("ircDisconnection", discordName, username);
            sockets.splice(sockets.indexOf({
                socket,
                discordName
            }), 1);
            io.emit("usernameRemove", username);
        })

        socket.on('keepAlive', () => {});

        setInterval(() => {
            socket.emit('keepAlive', 'keepAlive');
        }, 2000);
    });
}