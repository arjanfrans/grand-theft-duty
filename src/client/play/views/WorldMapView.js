import WaterBlocksView from './world/WaterBlocksView';
import StaticBlocksView from './world/StaticBlocksView';
import LightView from './lights/LightView';
import View from '../../../engine/graphics/View';

class WorldMapView extends View {
    constructor (map) {
        super();

        this.map = map;
        this.wallsView = new StaticBlocksView(map, 'tiles');
        this.waterView = new WaterBlocksView(map, 'tiles');
    }

    init () {
        this.mesh = new THREE.Object3D();

        for (let light of this.map.lights) {
            let lightView = new LightView(light);

            lightView.init();

            this.mesh.add(lightView.mesh);
        }

        this.wallsView.init();
        this.waterView.init();

        this.mesh.add(this.wallsView.mesh);
        this.mesh.add(this.waterView.mesh);

        super.init();
    }

    update () {
        this.waterView.update();
    }
}

export default WorldMapView;
