let debug = require('debug')('game:engine/logic/menu/Menu');

class Menu {
    constructor () {
        this.menuItems = [
            'Start',
            'Options'
        ];

        this.selectedItemIndex = 0;
    }

    get selectedItem () {
        return this.menuItems[this.selectedItemIndex];
    }

    moveUp () {
        if (this.selectedItemIndex > 0) {
            this.selectedItemIndex -= 1;
        } else {
            this.selectedItemIndex = 0;
        }

        debug('current item', this.selectedItem);
    }

    moveDown () {
        if (this.selectedItemIndex < this.menuItems.length - 1) {
            this.selectedItemIndex += 1;
        } else {
            this.selectedItemIndex = this.menuItems.length - 1;
        }

        debug('current item', this.selectedItem);
    }

    selectCurrentItem () {
        debug('selecting current item', this.selectedItem);
    }
}

export default Menu;
