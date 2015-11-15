let debug = require('debug')('game:engine/logic/menu/Menu');

class Menu {
    constructor () {
        this.menuItems = new Map();
        this.menuItemKeys = [];

        this.selectedItemIndex = 0;
    }

    addMenuItem (menuItem, action) {
        this.menuItemKeys.push(menuItem);
        this.menuItems.set(menuItem, action);
    }

    get selectedItem () {
        return this.menuItemKeys[this.selectedItemIndex];
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
        if (this.selectedItemIndex < this.menuItemKeys.length - 1) {
            this.selectedItemIndex += 1;
        } else {
            this.selectedItemIndex = this.menuItemKeys.length - 1;
        }

        debug('current item', this.selectedItem);
    }

    selectCurrentItem () {
        debug('selecting current item', this.selectedItem);

        let action = this.menuItems.get(this.selectedItem);

        action();
    }
}

export default Menu;
