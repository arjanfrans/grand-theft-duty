import {ThreeRenderer, ThreeRendererOptions} from "./ThreeRenderer";
import RenderDebug from "../utils/debug/RenderDebug";
import {WebGLProgram} from "three";

export class DebugThreeRenderer extends ThreeRenderer {
    private info: {} = {};
    private readonly renderDebug: RenderDebug;

    constructor (options: ThreeRendererOptions) {
        super(options);

        this.renderDebug = new RenderDebug(this);
        this.renderDebug.init();
    }

    render(interpolationPercentage) {
        this.webglRenderer.clear();

        const info = {
            memory: {
                programs: 0,
                geometries: 0,
                textures: 0
            },
            render: {
                calls: 0,
                vertices: 0,
                faces: 0,
                points: 0
            }
        };

        let index = 0;

        if (this.views) {
            for (const view of this.views) {
                if (index > 0) {
                    this.webglRenderer.clearDepth();
                }

                this.webglRenderer.render(view.scene, view.getCamera());

                const programs: WebGLProgram[] = this.webglRenderer.info.programs as unknown as WebGLProgram[];

                info.memory.programs += programs.length;
                info.memory.geometries += this.webglRenderer.info.memory.geometries;
                info.memory.textures += this.webglRenderer.info.memory.textures;
                info.render.calls += this.webglRenderer.info.render.calls;
                info.render.vertices += this.webglRenderer.info.render.vertices;
                info.render.faces += this.webglRenderer.info.render.faces;
                info.render.points += this.webglRenderer.info.render.points;

                index += 1;
            }

        }

        this.info = info;
    }

    preRender(): void {
        this.renderDebug.before();
    }

    postRender(): void {
        this.renderDebug.after();
    }
}
