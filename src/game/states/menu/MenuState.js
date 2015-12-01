import State from '../../../engine/states/State';

class MenuState extends State {

    constructor (menu) {
        super('menu');

        this.menu = menu;
    }

    init () {
        super.init();
    }

    update (delta) {
        super.updateInputs(delta);

        super.updateAudio(delta);
    }
}

export default MenuState;
