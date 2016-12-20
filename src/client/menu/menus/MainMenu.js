import Menu from '../../../engine/menu-system/Menu';
import MenuItem from '../../../engine/menu-system/MenuItem';
import BackgroundView from '../../../engine/graphics/BackgroundView';
import ViewContainer from '../../../engine/graphics/ViewContainer';
import MenuItemsView from '../views/MenuItemsView';
import PlayBuilder from '../../play/PlayBuilder';
import LogoView from '../../menu/views/LogoView';

/**
 * Create the play state.
 *
 * @param {Engine} engine Game engine.
 * @param {object} options Options for the play state.
 *
 * @return {PlayState} The created play state.
 */
function createPlayState (engine, options) {
    const playOptions = Object.assign({
        poolLimit: 200,
        teams: ['american', 'german'],
        cpuCount: 7,
        map: 'level2',
        playerName: 'unknown soldier'
    }, options);

    const playState = PlayBuilder.createSingleplayer(engine, playOptions);

    engine.addState('play', playState);

    return playState;
}

/**
 * Create the menu and add items to it.
 *
 * @param {Engine} engine Game engine instance.
 * @param {MenuState} menuState The menu state.
 *
 * @return {Menu} Menu instance.
 */
function createMenu (engine, menuState) {
    const menu = new Menu();

    menu.addMenuItem(new MenuItem('createGame', 'Singleplayer', (menuItem) => {
        let playState = engine.states.get('play');

        if (!playState) {
            playState = createPlayState(engine, {
                playerName: menuState.options.get('name')
            });

            menuItem.text = 'Create game';
        } else {
            menuState.gamePlaying = true;

            playState.player.name = menuState.options.get('name');
            menuItem.text = 'Continue game';
        }

        playState.resume();

        engine.changeState('play');
    }));

    menu.addMenuItem(new MenuItem('createMultiplayerGame', 'Multiplayer', (menuItem) => {
        menuState.currentMenu = 'multiplayer';
    }));

    menu.addMenuItem(new MenuItem('options', 'Options', () => {
        menuState.currentMenu = 'options';
    }));

    menu.addMenuItem(new MenuItem('help', 'Help', () => {
        menuState.currentMenu = 'help';
    }));

    return menu;
}

/**
 * Create the ViewContainer for this menu.
 *
 * @param {Menu} menu Menu instance.
 *
 * @return {ViewContainer} ViewContainer for the menu.
 */
function createView (menu) {
    const viewContainer = new ViewContainer();
    const background = new BackgroundView('normandy', 'ui');

    viewContainer.addDynamicView(new MenuItemsView(menu), { x: 500, y: 200, z: 0 });
    viewContainer.addStaticView(new LogoView('logo', 'ui'), { x: 300, y: 300, z: 0 });

    background.lightness = 0.5;
    viewContainer.backgroundView = background;

    return viewContainer;
}

const MainMenu = {
    create (engine, menuState) {
        const menu = createMenu(engine, menuState);
        const viewContainer = createView(menu);

        return {
            viewContainer: viewContainer,
            menu: menu
        };
    }
};

export default MainMenu;
