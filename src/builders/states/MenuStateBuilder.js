let debug = require('debug')('game:builders/states/MenuStateBuilder');

import MenuState from '../../engine/states/menu/MenuState';
import MenuRenderView from '../../engine/states/menu/MenuRenderView';
import Menu from '../../engine/logic/menu/Menu';
import MenuInput from '../../engine/input/menu/MenuInput';

import MenuItemsView from '../../engine/views/menu/MenuItemsView';

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

        return state;
    }
};

export default MenuStateBuilder;
