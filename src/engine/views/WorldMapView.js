import WaterBlocksView from './WaterBlocksView';
import StaticBlocksView from './StaticBlocksView';
import View from './View';

class WorldMapView extends View {
    constructor (map) {
        super();

        this.map = map;
        this.wallsView = new StaticBlocksView(map, 'tiles');
        this.waterView = new WaterBlocksView(map, 'tiles');
    }

    init () {
        super.init();

        this.mesh = new THREE.Object3D();

        this.wallsView.init();
        this.waterView.init();

        this.mesh.add(this.wallsView.mesh);
        this.mesh.add(this.waterView.mesh);
    }

    update () {
        this.waterView.update();
    }
}

export default WorldMapView;
