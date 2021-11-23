import {Camera, OrthographicCamera, PerspectiveCamera} from "three";
import {ThreeScene} from "../engine/renderer/render-view/ThreeScene";
import {Dimension} from "../engine/math/Dimension";

export class StatsScene extends ThreeScene {
    private camera?: OrthographicCamera = undefined;

    init() {
        super.init();

        this.camera = new OrthographicCamera(
            0,
            this.width,
            this.height,
            0,
            0,
            1
        );

        this._initialized = true;
    }

    changeSize(size: Dimension) {
        super.changeSize(size);

        this.init();
    }

    getCamera(): Camera | OrthographicCamera | PerspectiveCamera {
        return this.camera as OrthographicCamera;
    }
}
