import State from '../State';
import Vector from '../../engine/utils/vector';
import clientPrediction from './network/client-prediction';
import MainLoop from '../../engine/utils/mainloop';

const OPTIONS = {
    networkOffset: 100,
    networkBufferSize: 2,
    simulationTimestemp: 1000 / 66,
    timerFrequency: 1000 / 250,
    pingTimeout: 1000
};

function lerp3d (previous, target, interpolation) {
    return {
        x: previous.x + (target.x - previous.x) * interpolation,
        y: previous.y + (target.y - previous.y) * interpolation,
        z: previous.z + (target.z - previous.z) * interpolation
    }
}

class NetworkState extends State {
    constructor (match, map) {
        super('networkPlay');

        this.collisionSystem = null;
        this.bulletSystem = null;
        this.player = null;
        this.map = map;
        this.match = match;

        // FIXME get this out of here
        this.showScores = false;

        this.localTime = 0;
        this.netLatency = 0;
        this.lastPingTime = 0;
        this.targetTime = 0;
        this.clientTime = 0;
        this.serverTime = 0;
        this.serverUpdates = [];
        this.inputSeq = 0;
        this.network = null;

        this._timer = MainLoop.create().setSimulationTimestep(OPTIONS.timerFrequency);
        this._timer.setUpdate((delta => {
            this.localTime += delta / 1000;
        }));
    }

    init () {
        super.init();
        this._timer.start();

        // Ping the server
        setInterval(() => {
            this.network.ping();
        }, OPTIONS.pingTimeout || 1000);
    }

    get soldiers () {
        return this.match.soldiers;
    }

    get players () {
        return this.match.soldiers;
    }

    getPlayerById (playerId) {
        return Array.from(this.players).find(player => player.id === playerId);
    }

    addPlayer (player, teamName) {
        this.match.addSoldier(player, teamName);
    }

    removePlayer (player) {
        this.match.removeSoldier(player);
    }

    removePlayerById (playerId) {
        const player = this.getPlayerById(playerId);

        if (player) {
            player.isRemoved = true; // trigger remove from view

            this.match.removeSoldier(player);
        }
    }

    onServerUpdate (data) {
        this.serverTime = data.serverTime;
        this.clientTime = this.serverTime - (OPTIONS.networkOffset / 1000);

        this.serverUpdates.push(data);

        if (this.serverUpdates.length >= ((OPTIONS.simulationTimestemp * 1000) * OPTIONS.networkBufferSize)) {
            this.serverUpdates.splice(0, 1);
        }

        if (this.serverUpdates.length > 0) {
            clientPrediction(this);

            const delta = OPTIONS.simulationTimestemp;

            this.update(delta);
        }
    }

    _processNetworkUpdates () {
        if (this.serverUpdates.length === 0) {
            return;
        }

        let target = null;
        let previous = null;

        for (let i = 0; i < this.serverUpdates.length - 1; i++) {
            const update = this.serverUpdates[i];
            const nextUpdate = this.serverUpdates[i + 1];

            if (this.clientTime > update.serverTime && this.clientTime < nextUpdate.serverTime) {
                target = nextUpdate;
                previous = update;

                break;
            }
        }

        if (!target) {
            target = this.serverUpdates[0];
            previous = this.serverUpdates[0];
        }

        if (target && previous) {
            this.targetTime = target.serverTime;

            const difference = target.serverTime - this.clientTime;
            const maxDifference = target.serverTime - previous.serverTime;

            let timePoint = difference / maxDifference;

            if (Number.isNaN(timePoint) || Math.abs(timePoint) === Number.POSITIVE_INFINITY) {
                timePoint = 0;
            }

            const latestServerUpdate = this.serverUpdates[this.serverUpdates.length - 1];

            for (let i = 0; i < latestServerUpdate.players.length; i++) {
                const playerData = latestServerUpdate.players[i];

                if (target.players[i] && previous.players[i]) {
                    const player = this.getPlayerById(playerData.id);

                    if (player) {
                        player.previousPosition = lerp3d(previous.players[i].position, target.players[i].position, timePoint);
                        player.position = lerp3d(previous.players[i].position, target.players[i].position, timePoint);

                        player.angle = target.players[i].angle;
                        player.reverse = target.players[i].reverse;
                        player.isMoving = target.players[i].isMoving;
                        player.isRunning = target.players[i].isRunning;
                        player.dead = target.players[i].dead;
                        player.isFireing = target.players[i].isFireing;

                        if (target.players[i].isReloading) {
                            player.reload();
                        }

                        for (let j = 0; j < target.players[i].weapons.length; j++) {
                            player.weapons[j].ammo = target.players[i].weapons[j].ammo;
                            player.weapons[j].magazine = target.players[i].weapons[j].magazine;
                        }
                    }
                }
            }
        }
    }

    render (interpolation) {
        if (this.serverUpdates.length > 0) {
            this._processNetworkUpdates();
        }

        super.render(interpolation);
    }

    update (delta) {
        super.updateInputs(delta);

        super.updateAudio(delta);

        // Relies on previous turn
        if (this.bulletSystem) {
            this.bulletSystem.update(delta);
        }

        // for (let soldier of this.soldiers) {
        if (!this.player.dead) {
            this.player.processInput();

            if (this.collisionSystem) {
                this.collisionSystem.update(this.player, delta);
            }

            this.player.update(delta);
        }

        this.match.update(delta);
    }
}

export default NetworkState;
