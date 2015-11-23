let debug = require('debug')('game:engine/views/menu/MenuItemsView');

import TextView from '../../../engine/views/TextView';
import TextureManager from '../../../engine/graphics/TextureManager';
import TextureFrame from '../../../engine/graphics/TextureFrame';
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

        // FIXME get this hacky stuff out of here
        let textureAtlas = TextureManager.getAtlas('ui', false);

        let logoSize = textureAtlas.getFrameSize('logo');

        let geometry = new THREE.PlaneGeometry(logoSize.width, logoSize.height);

        let textureFrame = new TextureFrame(textureAtlas, geometry, 'logo');

        let material = new THREE.MeshBasicMaterial({
            map: textureFrame.texture,
            transparent: true
        });

        let logoMesh = new THREE.Mesh(geometry, material);

        logoMesh.position.x -= 160;

        this.mesh.add(logoMesh);
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

