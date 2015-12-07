import Views from '../../../engine/views';
import LogoView from './LogoView';
import View from '../../../engine/views/View';

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
        this.logoView = new LogoView('logo', 'ui');
    }

    init () {
        this.mesh = new THREE.Object3D();

        let distance = 100;
        let startY = 200;
        let itemCount = 0;

        this.selectedItem = this.menu.selectedItem;

        for (let menuItem of this.menu.menuItems.values()) {
            let textView = new Views.Text(menuItem.text, {
                width: 300
            });

            textView.init();
            textView.mesh.position.y = startY - (distance * itemCount);
            textView.mesh.position.x += 100;

            if (this.selectedItem === menuItem) {
                textView.color = this.options.selectedTextColor;
            } else {
                textView.color = this.options.textColor;
            }

            this.viewMenuItemPairs.set(menuItem, textView);

            this.mesh.add(textView.mesh);
            itemCount += 1;
        }

        super.init();
    }

    update () {
        // Selected item changed
        if (this.selectedItem !== this.menu.selectedItem) {
            let previousItem = this.selectedItem;

            this.selectedItem = this.menu.selectedItem;

            let currentView = this.viewMenuItemPairs.get(this.selectedItem);
            let previousView = this.viewMenuItemPairs.get(previousItem);

            currentView.text = this.selectedItem.text;

            previousView.color = this.options.textColor;
            currentView.color = this.options.selectedTextColor;
        }

        if (this.menu.selectedItem.editable && this.menu.selectedItem.isEditing) {
            let currentView = this.viewMenuItemPairs.get(this.selectedItem);

            currentView.text = this.selectedItem.text + '-';
        } else {
            let currentView = this.viewMenuItemPairs.get(this.selectedItem);

            currentView.text = this.selectedItem.text;
        }
    }
}

export default MenuItemsView;

