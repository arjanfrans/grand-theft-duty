/**
 * Base class for all views.
 *
 * @class
 */
class View {

    /**
     * @constructor
     *
     * @param {number} width - width of the view.
     * @param {number} height - height of the view.
     */
    constructor (width, height) {
        this.width = width;
        this.height = height;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
        this.camera.position.z = 1000;

        this.scene = new THREE.Scene();
    }

    update () {
        throw new TypeError('View requires update() method');
    }
}

module.exports = View;
