import View from '../view';

class MenuItemsView extends View {
    constructor (menu) {
        super();

        this.menu = menu;
    }

    init () {
        this._initialized = true;

        this.mesh = new THREE.Object3D();

        this.material = new THREE.MeshPhongMaterial({
            color: 0xdddddd
        });

        for (let menuItem of this.menu.menuItems) {
            let geometry = new THREE.TextGeometry(menuItem, {
                font: 'absender'
            });

            let mesh = new THREE.Mesh(geometry, mater);

            geometry.computeBoundingBox();

            this.mesh.add(mesh);
        }

        this._initialized = true;
    }
}

export default MenuItemsView;

