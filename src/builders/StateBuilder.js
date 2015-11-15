let debug = require('debug')('game:builders/StateBuilder');

import MenuStateBuilder from './states/MenuStateBuilder';
import PlayStateBuilder from './states/PlayStateBuilder';

let StateBuilder = {
    PlayState: PlayStateBuilder,
    MenuState: MenuStateBuilder
};

export default StateBuilder;
