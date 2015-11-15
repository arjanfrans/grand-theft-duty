let debug = require('debug')('game:engine/views/menu/MenuItemsView');

import TextView from '../text';
import View from '../view';

import TextureAtlas from '../../graphics/texture-atlas';

class MenuItemsView extends View {
    constructor (menu) {
        super();

        this.menu = menu;
        this.textViews = [];
    }

    init () {
        this.mesh = new THREE.Object3D();

        this.material = new THREE.MeshPhongMaterial({
            color: 0xffdddd
        });

        let distance = 100;
        let startY = 200;
        let itemCount = 0;

        for (let menuItem of this.menu.menuItems) {
            let textView = new TextView(menuItem);

            textView.init();
            textView.mesh.position.y = startY - (distance * itemCount);

            this.textViews.push(textView);

            this.mesh.add(textView.mesh);
            itemCount += 1;
        }

    }
}

export default MenuItemsView;

