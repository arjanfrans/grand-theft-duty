let NetworkEvents = {
    create (state) {
        return function (socket) {
            socket.on('respawn', (data) => {
                state.player.respawn(data.position);

                console.log('receiving "respawn"', data);
            });
        };
    }
};

export default NetworkEvents;
