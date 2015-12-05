class Menu {
    constructor () {
        this.menuItems = new Map();
        this.menuItemKeys = [];
        this.selectedItemIndex = 0;
    }

    addMenuItem (menuItem) {
        this.menuItemKeys.push(menuItem.name);
        this.menuItems.set(menuItem.name, menuItem);
    }

    get selectedItem () {
        return this.menuItems.get(this.menuItemKeys[this.selectedItemIndex]);
    }

    moveUp () {
        if (this.selectedItemIndex > 0) {
            this.selectedItemIndex -= 1;
        } else {
            this.selectedItemIndex = 0;
        }
    }

    moveDown () {
        if (this.selectedItemIndex < this.menuItemKeys.length - 1) {
            this.selectedItemIndex += 1;
        } else {
            this.selectedItemIndex = this.menuItemKeys.length - 1;
        }
    }

    selectCurrentItem () {
        this.selectedItem.action();
    }
}

export default Menu;
