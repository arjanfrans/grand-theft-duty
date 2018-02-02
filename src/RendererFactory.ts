import { WebGLRenderer } from "three";

class RendererFactory {
    public static webGLRenderer(
        width: number,
        height: number,
    ): WebGLRenderer {
        const renderer = new WebGLRenderer();

        renderer.setSize(width, height);
        renderer.setClearColor(0x000000);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.autoClear = false;

        return renderer;
    }
}

export default RendererFactory;
