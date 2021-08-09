import { StateAudio } from '../StateAudio';
import MenuState from "./MenuState";

class MenuAudio extends StateAudio {
    private selectedItem: any;
    private state: MenuState;

    constructor (state: MenuState, effectsSpriteName: string, backgroundSpriteName: string) {
        super(effectsSpriteName, backgroundSpriteName);

        this.state = state;
        this.selectedItem = state.currentMenu.selectedItem;
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
