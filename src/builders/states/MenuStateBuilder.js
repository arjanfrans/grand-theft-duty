let debug = require('debug')('game:builders/states/MenuStateBuilder');

import MenuState from '../../game/states/menu/MenuState';
import MenuRenderView from '../../game/states/menu/MenuRenderView';
import Menu from '../../game/logic/menu/Menu';
import MenuInput from '../../game/input/menu/MenuInput';

import MenuItemsView from '../../game/views/menu/MenuItemsView';

import MenuAudio from '../../game/audio/MenuAudio';

let _createMenu = function (engine) {
    let menu = new Menu();

    menu.addMenuItem('Start', function () {
        engine.changeState('play');
    });

    menu.addMenuItem('Options', function () {
        debug('not implemented');
    });

    return menu;
};

let MenuStateBuilder = {
    create (engine) {
        let menu = _createMenu(engine);

        let state = new MenuState(engine, menu);

        let menuInput = new MenuInput(menu);
        let menuView = new MenuRenderView(menu);

        state.inputs.add(menuInput);

        menuView.addDynamicView(new MenuItemsView(menu));

        state.addView(menuView);
        state.audio = new MenuAudio(menu, 'menu_effects', 'background');

        return state;
    }
};

export default MenuStateBuilder;
