let debug = require('debug')('game:game/ui/HealthView');

import View from '../../engine/views/View';
import TextureAtlas from '../../engine/graphics/TextureAtlas';

class HealthView extends View {
    constructor () {
        super();
    }

    init () {
        let textureAtlas = new TextureAtlas('ui');

        let material = new THREE.MeshBasicMaterial({
            map: textureAtlas.texture,
            transparent: true
        });

        let healthSize = textureAtlas.getFrameSize('heart');

        let mergedGeometry = new THREE.Geometry();

        let bounds = textureAtlas.getBounds('heart');

        for (let i = 0; i < 5; i++) {
            console.log(healthSize);
            let geometry = new THREE.PlaneGeometry(healthSize.width, healthSize.height);

            geometry.faceVertexUvs[0][0] = [bounds[0], bounds[1], bounds[3]];
            geometry.faceVertexUvs[0][1] = [bounds[1], bounds[2], bounds[3]];

            geometry.translate(i * healthSize.width, 0, 0);

            mergedGeometry.merge(geometry);
        }

        let healthMesh = new THREE.Mesh(mergedGeometry, material);

        healthMesh.scale.set(0.5, 0.5, 1);

        // TODO make nice positioning system for ui
        // healthMes.position.x = -(800 / 2) + healthSize.width;
        // healthMes.position.y = (600 / 2) - healthSize.height;
        // healthMesh.rotation.z = -90 * (Math.PI / 180);

        this.mesh = healthMesh;

        this._initialized = true;
    }

    update (delta) {
        super.update(delta);
    }
}

export default HealthView;
