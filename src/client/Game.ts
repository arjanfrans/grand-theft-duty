import Engine from '../engine/Engine';
import AssetManager from '../engine/AssetManager';
import path from 'path';

import MenuBuilder from './menu/MenuBuilder';
import {KeyboardInputSource} from "../engine/input/KeyboardInputSource";
import {GamepadInputSource} from "../engine/input/GamepadInputSource";
import {DebugThreeRenderer} from "../engine/renderer/DebugThreeRenderer";

const ASSET_PATH = path.resolve(__dirname, '../../assets/');
const ASSET_CONFIG = {
    paths: {
        maps: ASSET_PATH + '/maps',
        atlases: ASSET_PATH + '/spritesheets',
        fonts: ASSET_PATH + '/fonts',
        audio: ASSET_PATH + '/audio/sprites'
    },
    textureAtlases: [
        'soldier',
        'tiles',
        'world',
        'ui'
    ],
    maps: [
        'level1',
        'level2'
    ],
    fonts: [
        'keep_calm'
    ],
    audio: [
        'guns',
        'background',
        'menu_effects'
    ]
};

export class Game {

    /**
     * Load assets and start the game.
     */
    public async start (): Promise<void> {
        await AssetManager.init(ASSET_CONFIG);

        const engine = new Engine(
            {
                renderer: new DebugThreeRenderer({
                    div: 'root',
                    width: 800,
                    height: 600
                }),
                input: {
                    keyboard: new KeyboardInputSource(),
                    gamepad: new GamepadInputSource()
                }
            }
        );

        const menuState = MenuBuilder.create(engine);

        engine.addState('menu', menuState);

        engine.changeState('menu');

        engine.run();
    }
}
