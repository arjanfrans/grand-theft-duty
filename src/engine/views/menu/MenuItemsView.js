let debug = require('debug')('game:engine/views/menu/MenuItemsView');

import TextView from '../TextView';
import View from '../view';

class MenuItemsView extends View {
    constructor (menu, options = {
        selectedTextColor: 0x00ff00,
        textColor: 0xffdddd
    }) {
        super();

        this.menu = menu;
        this.options = options;
        this.viewMenuItemPairs = new Map();
        this.selectedItem = null;
        this.selectedView = null;
    }

    init () {
        this.mesh = new THREE.Object3D();

        let distance = 100;
        let startY = 200;
        let itemCount = 0;

        this.selectedItem = this.menu.selectedItem;

        for (let menuItem of this.menu.menuItemKeys) {
            let textView = new TextView(menuItem);

            textView.init();
            textView.mesh.position.y = startY - (distance * itemCount);

            if (this.selectedItem === menuItem) {
                textView.color = this.options.selectedTextColor;
            } else {
                textView.color = this.options.textColor;
            }

            this.viewMenuItemPairs.set(menuItem, textView);

            this.mesh.add(textView.mesh);
            itemCount += 1;
        }
    }

    update () {
        // Selected item changed
        if (this.selectedItem !== this.menu.selectedItem) {
            let previousItem = this.selectedItem;

            this.selectedItem = this.menu.selectedItem;

            let currentView = this.viewMenuItemPairs.get(this.selectedItem);
            let previousView = this.viewMenuItemPairs.get(previousItem);

            previousView.color = this.options.textColor;
            currentView.color = this.options.selectedTextColor;
        }
    }
}

export default MenuItemsView;

