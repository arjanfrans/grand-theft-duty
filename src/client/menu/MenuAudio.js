import StateAudio from '../StateAudio';

class MenuAudio extends StateAudio {
    constructor (state, effectsSpriteName, backgroundSpriteName) {
        super(state, effectsSpriteName, backgroundSpriteName);

        this.selectedItem = this.state.currentMenu.selectedItem;
    }

    update (delta) {
        // Selected item changed
        if (this.selectedItem !== this.state.currentMenu.selectedItem) {
            this.selectedItem = this.state.currentMenu.selectedItem;
            this.effects.play('select');
        }
    }
}

export default MenuAudio;
