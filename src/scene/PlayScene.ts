import {
    AmbientLight,
    Camera,
    OrthographicCamera,
    PerspectiveCamera,
    SpotLight,
} from "three";
import { ThreeScene } from "../engine/renderer/render-view/ThreeScene";
import { Dimension } from "../engine/math/Dimension";
import { PlayState } from "../state/PlayState";
import {View} from "../engine/graphics/View";

export class PlayScene extends ThreeScene {
    public camera?: PerspectiveCamera = undefined;
    private map: any;
    private _cameraFollowView?: any;
    private _cameraFollowLight?: SpotLight;

    constructor(state: PlayState) {
        super();

        this.map = state.map;
    }

    get cameraFollowView(): View {
        return this._cameraFollowView as View;
    }

    set cameraFollowView(view: View) {
        this._cameraFollowView = view;
    }

    get cameraFollowLight(): SpotLight {
        return this._cameraFollowLight as SpotLight;
    }

    changeSize(size: Dimension) {
        super.changeSize(size);

        this.init();
    }

    init() {
        super.init();

        this.camera = new PerspectiveCamera(
            75,
            this.map.width / this.map.height,
            100,
            1000
        );

        this.getCamera().position.x =
            (this.map.width / 2) * this.map.blockWidth;
        this.getCamera().position.y =
            (this.map.height / 2) * this.map.blockHeight;
        this.getCamera().position.z = this.map.blockDepth * 6;

        const ambientLight = new AmbientLight(0x030303);

        this.scene.add(ambientLight);

        if (this._cameraFollowView) {
            this._cameraFollowLight = new SpotLight(0xfffffff, 2, 800);
            this._cameraFollowLight.angle = 135 * (Math.PI / 180);
            this._cameraFollowLight.exponent = 10;
            this._cameraFollowLight.target = this._cameraFollowView.getMesh();

            this.scene.add(this._cameraFollowLight);
        }

        this._initialized = true;
    }

    update(delta: number) {
        super.update(delta);

        if (this.cameraFollowView) {
            this.getCamera().position.setX(this.cameraFollowView.getMesh().position.x);
            this.getCamera().position.setY(this.cameraFollowView.getMesh().position.y);

            this.cameraFollowLight.position.setX(
                this.cameraFollowView.getMesh().position.x
            );
            this.cameraFollowLight.position.setY(
                this.cameraFollowView.getMesh().position.y
            );
            this.cameraFollowLight.position.setZ(
                this.cameraFollowView.getMesh().position.z + 400
            );
        }
    }

    getCamera(): Camera | OrthographicCamera | PerspectiveCamera {
        return this.camera as PerspectiveCamera;
    }
}
