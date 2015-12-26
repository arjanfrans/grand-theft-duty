class NetworkSystem {
    constructor (state, networkManager) {
        this.state = state;
        this.player = this.state.player;
        this.networkManager = networkManager;
        this.socket = networkManager.socket;

        this.bufferSize = 2;
        this.netOffset = 100; // 100ms offset
        this.serverUpdates = [];
        this.serverTime = 0;
        this.clientTime = 0;
        this.oldestTick = null;
        this.inputCount = 0;
    }

    listen () {
        this.socket.on('respawn', (data) => {
            this.player.respawn(data.position);

            console.log('receiving "respawn"', data);
        });

        this.socket.on('update', (data) => {
            this.serverTime = data.time;
            this.clientTime = this.serverTime - (this.netOffset / 1000);
            this.serverUpdates.push(data);

            if (this.serverUpdates.length >= (60 * this.bufferSize)) {
                this.serverUpdates.splice(0, 1);
            }

            this.oldestTick = this.serverUpdates[0].time;
        });
    }

    netPredictionCorrection () {
        if (this.serverUpdates.length === 0) {
            return;
        }

        let latestServerData = this.serverUpdates[this.serverUpdates.length - 1];
        let playerServerPosition = latestServerData.player.position;

        let lastServerCount = latestServerData.count;

        if (lastServerCount) {
            let lastInputIndex = -1;

            for (let i = 0; i < this.player.inputs.length; i++) {
                if (this.player.inputs[i].count === lastServerCount) {
                    lastInputIndex = i;

                    break;
                }
            }

            if (lastInputIndex !== -1) {
               let numberToClear = Math.abs(lastInputIndex - (-1));

               this.player.inputs.slice(0, numberToClear);
               this.player.position = playerServerPosition;
            }
        }
    }

    update (delta) {
        if (this.player.lastInputs.length > 0) {
            this.socket.emit('update', {
                playerInputs: {
                    inputs: Array.from(this.player.lastInputs),
                    count: this.inputCount
                }
            });

            this.inputCount += 1;
        }
    }
}

export default NetworkSystem;
