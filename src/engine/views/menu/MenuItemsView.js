let debug = require('debug')('game:engine/views/menu/MenuItemsView');

import TextView from '../text';
import View from '../view';

class MenuItemsView extends View {
    constructor (menu) {
        super();

        this.menu = menu;
        this.viewMenuItemPairs = new Map();
        this.selectedItem = null;
        this.selectedView = null;

        this.selectedTextColor = 0x00ff00;
        this.textColor = 0xffdddd;
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
                textView.color = this.selectedTextColor;
            } else {
                textView.color = this.textColor;
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

            previousView.color = this.textColor;
            currentView.color = this.selectedTextColor;
        }
    }
}

export default MenuItemsView;

