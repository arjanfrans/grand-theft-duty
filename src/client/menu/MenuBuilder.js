import { ViewContainer, BackgroundView } from '../../engine/graphics';
import MenuItem from '../../engine/menu-system/MenuItem';
import MenuInput from './MenuInput';
import MenuItemsView from './views/MenuItemsView';
import MenuRenderView from './views/MenuRenderView';
import LogoView from './views/LogoView';
import MenuAudio from './MenuAudio';
import Menu from '../../engine/menu-system/Menu';
import OptionsMenu from './OptionsMenu';
import HelpMenu from './HelpMenu';
import PlayBuilder from '../play/PlayBuilder';

import MenuState from './MenuState';

/**
 * Create the play state.
 *
 * @param {Engine} engine Game engine.
 * @param {object} options Options for the play state.
 *
 * @return {PlayState} The created play state.
 */
function createPlayState (engine, options) {
    let playOptions = Object.assign({
        poolLimit: 200,
        teams: ['american', 'german'],
        cpuCount: 7,
        map: 'level2',
        playerName: 'unknown soldier'
    }, options);

    let playState = PlayBuilder.createSingleplayer(engine, playOptions);

    engine.addState('play', playState);

    return playState;
}

let MenuBuilder = {
    create (engine) {
        this.engine = engine;
        this.state = new MenuState();
        this.menu = new Menu();

        let menuInput = new MenuInput(this.state);

        this.state.inputs.add(menuInput);

        this.subMenus = new Map([
            ['options', OptionsMenu.create(this.state)],
            ['help', HelpMenu.create(this.state)]
        ]);

        this._createMenuItems();

        this.state.currentMenu = 'main';
        this.state.audio = new MenuAudio(this.state, 'menu_effects', 'background');

        this._createView();

        return this.state;
    },

    _createMenuItems () {
        this.menu.addMenuItem(new MenuItem('createGame', 'Create game', (menuItem) => {
            let playState = this.engine.states.get('play');

            if (!playState) {
                playState = createPlayState(this.engine, {
                    playerName: this.state.options.get('name')
                });

                menuItem.text = 'Create game';
            } else {
                this.state.gamePlaying = true;

                playState.player.name = this.state.options.get('name');
                menuItem.text = 'Continue game';
            }

            playState.resume();

            this.engine.changeState('play');
        }));

        this.menu.addMenuItem(new MenuItem('options', 'Options', () => {
            this.state.currentMenu = 'options';
        }));

        this.menu.addMenuItem(new MenuItem('help', 'Help', () => {
            this.state.currentMenu = 'help';
        }));

        for (let [subMenuName, subMenu] of this.subMenus.entries()) {
            this.state.addMenu(subMenuName, subMenu.menu);
        }

        this.state.addMenu('main', this.menu);
    },

    _createView () {
        let menuView = new MenuRenderView(this.state);
        let viewContainer = new ViewContainer();
        let background1 = new BackgroundView('normandy', 'ui');

        viewContainer.addDynamicView(new MenuItemsView(this.menu), { x: 500, y: 100, z: 0 });
        viewContainer.addStaticView(new LogoView('logo', 'ui'), { x: 300, y: 300, z: 0 });

        background1.lightness = 0.5;
        viewContainer.backgroundView = background1;

        for (let [subMenuName, subMenu] of this.subMenus.entries()) {
            menuView.addViewContainer(subMenuName, subMenu.viewContainer);
        }

        menuView.addViewContainer('main', viewContainer);

        menuView.currentViewContainer = 'main';

        this.state.addView(menuView);
    }
};

export default MenuBuilder;
