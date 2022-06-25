const { Server } = require('socket.io');

module.exports = (server) => {
    const io = new Server(server);

    const sockets = [];
    const usernames = [];

    function sendSockets(event, ...args) {
        sockets.forEach(s => s.socket.emit(event, ...args));
    }

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
            sendSockets("usernameSet", usernames)
            sendSockets("ircConnection", discordName, username);
        })

        socket.on("message", (...args) => {
            var message = args[0];

            sendSockets("newMessage", discordName, message, username);
        })

        socket.on("disconnect", () => {
            sockets.splice(sockets.indexOf({
                socket,
                discordName
            }), 1);
            sendSockets("usernameRemove", username);
            sendSockets("ircDisconnection", discordName, username);
        })

        socket.on("setUsername", (...args) => {
            username = args[0];
            usernames.push(`${username}:${discordName}`);
            sendSockets("usernameSet", usernames);
        })
    });
}