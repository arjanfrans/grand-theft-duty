import MapParser from "./core/maps/MapParser";
import path from "path";
import AssetManager from "./engine/AssetManager";
import { Engine } from "./engine/Engine";
import { KeyboardInputSource } from "./engine/input/KeyboardInputSource";
import { GamepadInputSource } from "./engine/input/GamepadInputSource";
import { PlayState } from "./state/PlayState";
import { DebugThreeRenderer } from "./engine/renderer/DebugThreeRenderer";
import { StatsScene } from "./state/StatsScene";
import ViewContainer from "./engine/graphics/ViewContainer";
import { HealthView } from "./views/HealthView";
import { Entity } from "./ecs/entities/Entity";
import { WeaponView } from "./views/WeaponView";
import AmmoView from "./views/AmmoView";
import { TeamComponent } from "./ecs/components/TeamComponent";
import { ScoreView } from "./views/ScoreView";
import { PlayerFactory } from "./factory/PlayerFactory";
import { SoldierFactory } from "./factory/SoldierFactory";

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
            height: 600,
        }),
        input: {
            keyboard: new KeyboardInputSource(),
            gamepad: new GamepadInputSource(),
        },
    });

    const map = MapParser.parse(AssetManager.getMap("level1"));
    const playState = new PlayState(engine, map);

    const teamA = new Entity([new TeamComponent("american")]);
    const teamB = new Entity([new TeamComponent("german")]);

    const player = PlayerFactory.create(
        "player1",
        "american",
        map.randomRespawnPosition()
    );

    const cpu1 = SoldierFactory.create(
        "cpu1",
        "american",
        map.randomRespawnPosition()
    );
    const cpu2 = SoldierFactory.create(
        "cpu2",
        "german",
        map.randomRespawnPosition()
    );
    const cpu3 = SoldierFactory.create(
        "cpu3",
        "german",
        map.randomRespawnPosition()
    );

    playState.em.addEntity(teamA);
    playState.em.addEntity(cpu1);
    playState.em.addEntity(cpu2);
    playState.em.addEntity(cpu3);
    playState.em.addEntity(teamB);
    playState.em.addEntity(player);

    const statsScene = new StatsScene(playState);
    const uiViewContainer = new ViewContainer();
    const healthView = new HealthView(playState);
    const weaponView = new WeaponView(playState);
    const ammoView = new AmmoView(playState);
    const scoreView = new ScoreView(playState);

    uiViewContainer.addDynamicView(healthView, { x: 600, y: 540, z: 0 });
    uiViewContainer.addDynamicView(weaponView, { x: 280, y: 540, z: 0 });
    uiViewContainer.addDynamicView(ammoView, { x: 10, y: 540, z: 0 });
    uiViewContainer.addDynamicView(scoreView, { x: 100, y: 100, z: 0 });

    statsScene.addViewContainer("stats", uiViewContainer);
    statsScene.currentViewContainer = "stats";

    playState.addScene(statsScene);

    engine.addState("play", playState);
    engine.changeState("play");

    engine.run();
})();
