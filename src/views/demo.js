let View = require('../engine/view');
let ImprovedNoise = require('../utils/improved-noise');

class DemoView extends View {
    constructor (state) {
        super(800, 600);

        this.state = state;
    }

    init () {
        function getY (x, z) {
            return (data[ x + z * worldWidth ] * 0.2) | 0;
        }

        function generateHeight (width, height) {
            let data = [];
            let perlin = new ImprovedNoise();
            let size = width * height;
            let quality = 2;
            let z = Math.random() * 100;

            for (let j = 0; j < 4; j++) {
                if (j === 0) {
                    for (let i = 0; i < size; i++) {
                        data[i] = 0;
                    }
                }

                for (let i = 0; i < size; i++) {
                    let x = i % width;
                    let y = (i / width) | 0;

                    data[i] += perlin.noise(x / quality, y / quality, z) * quality;
                }

                quality *= 4;
            }

            return data;
        }

        let worldWidth = 128;
        let worldDepth = 128;
        let worldHalfWidth = worldWidth / 2;
        let worldHalfDepth = worldDepth / 2;
        let data = generateHeight(worldWidth, worldDepth);

        this.camera.position.y = getY(worldHalfWidth, worldHalfDepth) * 100 + 100;

        // Rotate camera for top-down view.
        this.camera.rotation.x = -90 * Math.PI / 180;

        let matrix = new THREE.Matrix4();

        let pxGeometry = new THREE.PlaneBufferGeometry(100, 100);

        pxGeometry.attributes.uv.array[1] = 0.5;
        pxGeometry.attributes.uv.array[3] = 0.5;
        pxGeometry.rotateY(Math.PI / 2);
        pxGeometry.translate(50, 0, 0);

        let nxGeometry = new THREE.PlaneBufferGeometry(100, 100);

        nxGeometry.attributes.uv.array[1] = 0.5;
        nxGeometry.attributes.uv.array[3] = 0.5;
        nxGeometry.rotateY(-Math.PI / 2);
        nxGeometry.translate(-50, 0, 0);

        let pyGeometry = new THREE.PlaneBufferGeometry(100, 100);

        pyGeometry.attributes.uv.array[5] = 0.5;
        pyGeometry.attributes.uv.array[7] = 0.5;
        pyGeometry.rotateX(-Math.PI / 2);
        pyGeometry.translate(0, 50, 0);

        let pzGeometry = new THREE.PlaneBufferGeometry(100, 100);

        pzGeometry.attributes.uv.array[1] = 0.5;
        pzGeometry.attributes.uv.array[3] = 0.5;
        pzGeometry.translate(0, 0, 50);

        let nzGeometry = new THREE.PlaneBufferGeometry(100, 100);

        nzGeometry.attributes.uv.array[1] = 0.5;
        nzGeometry.attributes.uv.array[3] = 0.5;
        nzGeometry.rotateY(Math.PI);
        nzGeometry.translate(0, 0, -50);

        // BufferGeometry cannot be merged yet.
        let tmpGeometry = new THREE.Geometry();
        let pxTmpGeometry = new THREE.Geometry().fromBufferGeometry(pxGeometry);
        let nxTmpGeometry = new THREE.Geometry().fromBufferGeometry(nxGeometry);
        let pyTmpGeometry = new THREE.Geometry().fromBufferGeometry(pyGeometry);
        let pzTmpGeometry = new THREE.Geometry().fromBufferGeometry(pzGeometry);
        let nzTmpGeometry = new THREE.Geometry().fromBufferGeometry(nzGeometry);

        for (let z = 0; z < worldDepth; z++) {
            for (let x = 0; x < worldWidth; x++) {
                let h = getY(x, z);

                matrix.makeTranslation(
                    x * 100 - worldHalfWidth * 100,
                    h * 100,
                    z * 100 - worldHalfDepth * 100
                );

                let px = getY(x + 1, z);
                let nx = getY(x - 1, z);
                let pz = getY(x, z + 1);
                let nz = getY(x, z - 1);

                tmpGeometry.merge(pyTmpGeometry, matrix);

                if ((px !== h && px !== h + 1) || x === 0) {
                    tmpGeometry.merge(pxTmpGeometry, matrix);
                }

                if ((nx !== h && nx !== h + 1) || x === worldWidth - 1) {
                    tmpGeometry.merge(nxTmpGeometry, matrix);
                }

                if ((pz !== h && pz !== h + 1) || z === worldDepth - 1) {
                    tmpGeometry.merge(pzTmpGeometry, matrix);
                }

                if ((nz !== h && nz !== h + 1) || z === 0) {
                    tmpGeometry.merge(nzTmpGeometry, matrix);
                }
            }
        }

        let geometry = new THREE.BufferGeometry().fromGeometry(tmpGeometry);

        geometry.computeBoundingSphere();

        let texture = THREE.ImageUtils.loadTexture('assets/images/minecraft.png');

        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;

        let mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ map: texture }));

        this.scene.add(mesh);

        let ambientLight = new THREE.AmbientLight(0xcccccc);

        this.scene.add(ambientLight);

        let directionalLight = new THREE.DirectionalLight(0xffffff, 2);

        directionalLight.position.set(1, 1, 0.5).normalize();
        this.scene.add(directionalLight);
    }

    update () {
        // this.mesh.rotation.x += 0.01;
    }
}

module.exports = DemoView;
