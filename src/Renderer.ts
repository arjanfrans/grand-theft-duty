import { WebGLRenderer } from "three";
import IRenderer from "./IRenderer";
import IState from "./IState";

interface IRenderInfo {
    memory: {
        programs: number,
        geometries: number,
        textures: number,
    };
    render: {
        calls: number,
        vertices: number,
        faces: number,
        points: number,
    };
}

const INFO = {
    memory: {
        programs: 0,
        geometries: 0,
        textures: 0,
    },
    render: {
        calls: 0,
        vertices: 0,
        faces: 0,
        points: 0,
    },
};

class Renderer implements IRenderer {
    private renderer: WebGLRenderer;
    private info: IRenderInfo = INFO;

    constructor(renderer: WebGLRenderer) {
        this.renderer = renderer;
    }

    public renderState(state: IState): void {
        this.renderer.render(
            state.getScene(),
            state.getCamera(),
        );
    }

    public before() {
        this.renderer.clear();
        this.info = INFO;
    }

    public after() {
        this.info.memory.programs += this.renderer.info.programs;
        this.info.memory.geometries += this.renderer.info.memory.geometries;
        this.info.memory.textures += this.renderer.info.memory.textures;
        this.info.render.calls += this.renderer.info.render.calls;
        this.info.render.vertices += this.renderer.info.render.vertices;
        this.info.render.faces += this.renderer.info.render.faces;
        this.info.render.points += this.renderer.info.render.points;
    }

    public getInfo() {
        return this.info;
    }
}

export default Renderer;
