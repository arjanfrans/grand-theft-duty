import MapParser from "./core/maps/MapParser";
import path from "path";
import AssetManager from "./engine/AssetManager";
import {Engine} from "./engine/Engine";
import {KeyboardInputSource} from "./engine/input/KeyboardInputSource";
import {GamepadInputSource} from "./engine/input/GamepadInputSource";
import {PlayState} from "./state/PlayState";
import {DebugThreeRenderer} from "./engine/renderer/DebugThreeRenderer";
import {StatsScene} from "./state/StatsScene";
import ViewContainer from "./engine/graphics/ViewContainer";
import {HealthView} from "./views/HealthView";
import {Entity} from "./ecs/Entity";
import {MovementComponent} from "./ecs/components/MovementComponent";
import {PositionComponent} from "./ecs/components/PositionComponent";
import {DimensionComponent} from "./ecs/components/DimensionComponent";
import {AliveComponent} from "./ecs/components/AliveComponent";
import {CollisionComponent} from "./ecs/components/CollisionComponent";
import {WalkingComponent} from "./ecs/components/WalkingComponent";
import {SoldierComponent} from "./ecs/components/SoldierComponent";
import {PlayerControllableComponent} from "./ecs/components/PlayerControllableComponent";
import {WeaponView} from "./views/WeaponView";
import {WeaponComponent} from "./ecs/components/WeaponComponent";
import WeaponFactory from "./core/weapons/WeaponFactory";
import AmmoView from "./views/AmmoView";


const ASSET_PATH = path.resolve(__dirname, "../../assets/");
const ASSET_CONFIG = {
    paths: {
        maps: ASSET_PATH + "/maps",
        atlases: ASSET_PATH + "/spritesheets",
        fonts: ASSET_PATH + "/fonts",
        audio: ASSET_PATH + "/audiosprites",
    },
    textureAtlases: ["soldier", "tiles", "world", "ui"],
    maps: ["level1", "level2"],
    fonts: ["keep_calm"],
    audio: ["guns", "background", "menu_effects"],
};

(async () => {
    await AssetManager.init(ASSET_CONFIG);

    const engine = new Engine({
        renderer: new DebugThreeRenderer({
            div: "root",
            width: 800,
            height: 600
        }),
        input: {
            keyboard: new KeyboardInputSource(),
            gamepad: new GamepadInputSource(),
        },
    });

    const map = MapParser.parse(AssetManager.getMap("level1"));
    const playState = new PlayState(engine, map);

    const playerPosition = map.randomRespawnPosition();

    const player = new Entity([
        new AliveComponent(),
        new CollisionComponent(),
        new MovementComponent(),
        new DimensionComponent(48, 48, 1),
        new PositionComponent(playerPosition.x, playerPosition.y, playerPosition.z),
        new WalkingComponent(),
        new SoldierComponent(),
        new PlayerControllableComponent(),
        new WeaponComponent(
            [WeaponFactory.mp44(), WeaponFactory.thompson()]
        )
    ])

    playState.em.addEntity(player)

    const statsScene = new StatsScene(playState)
    const uiViewContainer = new ViewContainer();
    const healthView = new HealthView(playState);
    const weaponView = new WeaponView(playState);
    const ammoView = new AmmoView(playState);

    uiViewContainer.addDynamicView(healthView, { x: 600, y: 540, z: 0 });
    uiViewContainer.addDynamicView(weaponView, { x: 280, y: 540, z: 0 });
    uiViewContainer.addDynamicView(ammoView, { x: 10, y: 540, z: 0 });

    statsScene.addViewContainer("stats", uiViewContainer);
    statsScene.currentViewContainer = 'stats';

    playState.addScene(statsScene)

    engine.addState("play", playState);
    engine.changeState("play");

    engine.run();
})()
