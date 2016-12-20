import { OrthographicCamera } from 'three';
import RenderView from '../../../engine/graphics/RenderView';

// TODO fix duplicate code of subviews
class StatsRenderView extends RenderView {
    constructor (state) {
        super();

        this.state = state;
    }

    init () {
        super.init();

        this.camera = new OrthographicCamera(0, this.width,
            this.height, 0, 0, 1);

        this._initialized = true;
    }

    update (delta) {
        super.update(delta);
    }

}

export default StatsRenderView;
