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
            io.emit("usernameSet", usernames)
            io.emit("ircConnection", discordName, username);
        })

        socket.on('onChat', (...args) => {
            var usernames = [];
            console.log(sockets.length);
            for (var i = 0; i < sockets.length; i++) {
                console.log(sockets[i].discordName + ":" + sockets[i].username);
            }
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
            io.emit("ircDisconnection", discordName, username);
            sockets.splice(sockets.indexOf({
                socket,
                discordName
            }), 1);
            io.emit("usernameRemove", username);
        })

        socket.on("setUsername", (...args) => {
            username = args[0];
            usernames.push(`${username}:${discordName}`);
            io.emit("usernameSet", usernames);
        })

        socket.on('keepAlive', () => {});

        setInterval(() => {
            socket.emit('keepAlive', 'keepAlive');
        }, 2000);
    });
}