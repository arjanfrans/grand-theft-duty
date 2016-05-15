function clientPrediction (state) {
    const latestServerData = state.serverUpdates[state.serverUpdates.length - 1];

    const lastInputSeq = latestServerData.ownPlayer.lastInputSeq;

    if (lastInputSeq) {
        let lastInputSeqIndex = -1;

        for (let i = 0; i < state.player.inputs.length; i++) {
            if (state.player.inputs[i].seq === lastInputSeq) {
                lastInputSeqIndex = i;
                break;
            }
        }

        if (lastInputSeq !== -1) {
            const clearInputs = Math.abs(lastInputSeqIndex - (-1));

            state.player.inputs.splice(0, clearInputs);

            state.player.position = latestServerData.ownPlayer.position;
            state.player.angle = latestServerData.ownPlayer.angle;
            state.player.reverse = latestServerData.ownPlayer.reverse;
            state.player.isMoving = latestServerData.ownPlayer.isMoving;
            state.player.isRunning = latestServerData.ownPlayer.isRunning;
            state.player.dead = latestServerData.ownPlayer.dead;
            state.player.isFireing = latestServerData.ownPlayer.isFireing;

            if (state.player.isReloading) {
                state.player.reload();
                state.player.isReloading = false;
            }

            state.player.lastInputSeq = lastInputSeqIndex;
        }
    }
}

export default clientPrediction;
