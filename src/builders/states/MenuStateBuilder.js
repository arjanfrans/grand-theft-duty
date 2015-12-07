let debug = require('debug')('game:builders/states/MenuStateBuilder');

import MenuState from '../../game/states/menu/MenuState';
import MenuRenderView from '../../game/states/menu/MenuRenderView';
import ViewContainer from '../../engine/views/ViewContainer';
import BackgroundView from '../../engine/views/BackgroundView';
import Menu from '../../engine/menu/Menu';
import MenuItem from '../../engine/menu/MenuItem';
import MenuInputItem from '../../engine/menu/MenuInputItem';
import MenuInput from '../../game/input/menu/MenuInput';

import MenuItemsView from '../../game/views/menu/MenuItemsView';
import LogoView from '../../game/views/menu/LogoView';

import MenuAudio from '../../game/audio/MenuAudio';

let _createMenus = function (engine, state) {
    let mainMenu = new Menu();

    mainMenu.addMenuItem(new MenuItem('createGame', 'Create game', function (menuItem) {
        engine.changeState('play');
        let playState = engine.states.get('play');

        playState.player.name = state.options.get('name');

        playState.network.player = playState.player;
        playState.network.register(state.options.get('name'));

        playState.resume();
        state.gamePlaying = true;
        menuItem.text = 'Continue game';
    }));

    mainMenu.addMenuItem(new MenuItem('options', 'Options', function () {
        state.currentMenu = 'options';
    }));

    mainMenu.addMenuItem(new MenuItem('help', 'Help', function () {
        debug('not implemented');
    }));

    let optionsMenu = new Menu();

    optionsMenu.addMenuItem(new MenuInputItem('name', 'Name', 'Unknown Soldier', function (value) {
        state.changeOption('name', value);
    }));

    optionsMenu.addMenuItem(new MenuItem('back', '- back', function () {
        state.currentMenu = 'main';
    }));

    state.addMenu('main', mainMenu);
    state.addMenu('options', optionsMenu);
    state.currentMenu = 'main';

    let menuView = new MenuRenderView(state);

    let mainMenuViewContainer = new ViewContainer();

    mainMenuViewContainer.addDynamicView(new MenuItemsView(mainMenu), { x: 500, y: 100, z: 0 });
    mainMenuViewContainer.addStaticView(new LogoView('logo', 'ui'), { x: 300, y: 300, z: 0 });

    let background1 = new BackgroundView('normandy', 'ui');

    background1.lightness = 0.5;

    mainMenuViewContainer.backgroundView = background1;

    let optionsMenuViewContainer = new ViewContainer();

    optionsMenuViewContainer.addDynamicView(new MenuItemsView(optionsMenu), { x: 300, y: 100, z: 0 });

    let background2 = new BackgroundView('iwo_jima', 'ui');

    background2.lightness = 0.5;
    optionsMenuViewContainer.backgroundView = background2;

    menuView.addViewContainer('main', mainMenuViewContainer);
    menuView.addViewContainer('options', optionsMenuViewContainer);
    menuView.currentViewContainer = 'main';

    state.addView(menuView);
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
