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
            })
            usernames.push(`${username}:${discordName}`);
            io.emit("usernameSet", usernames)
            io.emit("ircConnection", discordName, username);
        })

        socket.on("message", (...args) => {
            var message = args[0];

            io.emit("newMessage", discordName, message, username);
        })

        socket.on("disconnect", () => {
            sockets.splice(sockets.indexOf({
                socket,
                discordName
            }), 1);
            io.emit("usernameRemove", username);
            io.emit("ircDisconnection", discordName, username);
        })

        socket.on("setUsername", (...args) => {
            username = args[0];
            usernames.push(`${username}:${discordName}`);
            io.emit("usernameSet", usernames);
        })
    });
}