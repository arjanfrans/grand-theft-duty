import {AmbientLight, Camera, OrthographicCamera, PerspectiveCamera, SpotLight} from 'three';
import {ThreeRenderView} from '../../../engine/renderer/ThreeRenderView';
import {PlayState} from "../PlayState";
import {Dimension} from "../../../engine/math/Dimension";

export class PlayRenderView extends ThreeRenderView {
    public camera?: PerspectiveCamera = undefined;
    private state: PlayState;
    private map: any;
    private _cameraFollowView?: any;
    private _cameraFollowLight?: SpotLight;

    constructor (state: PlayState) {
        super();

        this.state = state;
        this.map = this.state.map;
    }

    get cameraFollowView(): any
    {
        return this._cameraFollowView as any;
    }

    get cameraFollowLight(): SpotLight
    {
        return this._cameraFollowLight as SpotLight;
    }

    changeSize(size: Dimension) {
        super.changeSize(size);

        this.init();
    }

    init () {
        super.init();

        this.camera = new PerspectiveCamera(75, this.map.width / this.map.height, 100, 1000);

        this.getCamera().position.x = (this.map.width / 2) * this.map.blockWidth;
        this.getCamera().position.y = (this.map.height / 2) * this.map.blockHeight;
        this.getCamera().position.z = this.map.blockDepth * 6;

        const ambientLight = new AmbientLight(0x030303);

        this.scene.add(ambientLight);

        this._cameraFollowLight = new SpotLight(0xfffffff, 2, 800);
        this._cameraFollowLight.angle = 135 * (Math.PI / 180);
        this._cameraFollowLight.exponent = 10;
        this._cameraFollowLight.target = this._cameraFollowView.mesh;

        this.scene.add(this._cameraFollowLight);

        this._initialized = true;
    }

    update (delta: number) {
        if (this.state.paused) {
            return;
        }

        super.update(delta);

        if (this.cameraFollowView) {
            this.getCamera().position.setX(this.cameraFollowView.position.x);
            this.getCamera().position.setY(this.cameraFollowView.position.y);

            this.cameraFollowLight.position.setX(this.cameraFollowView.position.x);
            this.cameraFollowLight.position.setY(this.cameraFollowView.position.y);
            this.cameraFollowLight.position.setZ(this.cameraFollowView.position.z + 400);
        }
    }

    getCamera(): Camera | OrthographicCamera | PerspectiveCamera {
        return this.camera as PerspectiveCamera;
    }
}
