import State from '../State';

class LobbyState extends State {

    constructor () {
        super('lobby');

        this.menu = null;
        this._currentMenu = null;
        this.currentMenuName = null;
        this.gamePlaying = false;
        this.currentOptionsEdit = null;
        this.players = new Map();
    }

    addPlayer (name, player) {
        this.players.set(name, player);
    }

    init () {
        super.init();
    }

    update (delta) {
        super.updateInputs(delta);

        super.updateAudio(delta);
    }
}

export default LobbyState;
