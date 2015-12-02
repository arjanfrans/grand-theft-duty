let debug = require('debug')('game:builders/states/MenuStateBuilder');

import MenuState from '../../game/states/menu/MenuState';
import MenuRenderView from '../../game/states/menu/MenuRenderView';
import ViewContainer from '../../engine/views/ViewContainer';
import Menu from '../../engine/menu/Menu';
import MenuInput from '../../game/input/menu/MenuInput';

import MenuItemsView from '../../game/views/menu/MenuItemsView';
import LogoView from '../../game/views/menu/LogoView';

import MenuAudio from '../../game/audio/MenuAudio';

let _createMenus = function (engine, state) {
    let mainMenu = new Menu();

    mainMenu.addMenuItem('Create game', function () {
        engine.changeState('play');
    });

    mainMenu.addMenuItem('Options', function () {
        state.currentMenu = 'options';
    });

    mainMenu.addMenuItem('Exit', function () {
        debug('not implemented');
    });

    let optionsMenu = new Menu();

    optionsMenu.addMenuItem('Name', function () {
        debug('not implemented');
    });

    optionsMenu.addMenuItem('- back', function () {
        state.currentMenu = 'main';
    });

    state.addMenu('main', mainMenu);
    state.addMenu('options', optionsMenu);
    state.currentMenu = 'main';

    let menuView = new MenuRenderView(state);

    let mainMenuViewContainer = new ViewContainer();

    mainMenuViewContainer.addDynamicView(new MenuItemsView(mainMenu));
    mainMenuViewContainer.addStaticView(new LogoView('logo', 'ui'));

    let optionsMenuViewContainer = new ViewContainer();

    optionsMenuViewContainer.addDynamicView(new MenuItemsView(optionsMenu));
    optionsMenuViewContainer.addStaticView(new LogoView('iwo_jima', 'ui'));

    menuView.addViewContainer('main', mainMenuViewContainer);
    menuView.addViewContainer('options', optionsMenuViewContainer);

    state.addView(menuView);
    state.currentViewContainer = 'main';
};

let MenuStateBuilder = {
    create (engine) {
        let state = new MenuState();

        _createMenus(engine, state);

        let menuInput = new MenuInput(state);

        state.inputs.add(menuInput);

        state.audio = new MenuAudio(state, 'menu_effects', 'background');

        return state;
    }
};

export default MenuStateBuilder;
