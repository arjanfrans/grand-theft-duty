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
            color: 0xffdddd
        });

        for (let menuItem of this.menu.menuItems) {
            let geometry = new THREE.TextGeometry(menuItem, {
                font: 'optimer',
                weight: 'normal',
                style: 'normal',
                size: 40,
                height: 500
            });

            geometry.computeBoundingBox();
            geometry.computeVertexNormals();

            let mesh = new THREE.Mesh(geometry, this.material);

            this.mesh.add(mesh);
        }

        this._initialized = true;
    }
}

export default MenuItemsView;

