import Engine from "../src/Engine";
import Renderer from "../src/Renderer";
import RendererFactory from "../src/RendererFactory";

const SIMULATION_TIMESTEP = 1000 / 60;
const MAX_FPS = 60;

const webGLRenderer = RendererFactory.webGLRenderer(800, 600);

const renderer = new Renderer(webGLRenderer);
const engine = new Engine(
    SIMULATION_TIMESTEP,
    MAX_FPS,
    renderer,
);

document.getElementById("game").appendChild(webGLRenderer.domElement);
