import MenuInput from './MenuInput';
import MenuRenderView from './views/MenuRenderView';
import MenuAudio from './MenuAudio';
import OptionsMenu from './menus/OptionsMenu';
import MultiplayerMenu from './menus/MultiplayerMenu';
import HelpMenu from './menus/HelpMenu';
import MainMenu from './menus/MainMenu';
import MenuState from './MenuState';

let MenuBuilder = {
    create (engine) {
        let state = new MenuState();
        let menuInput = new MenuInput(state);

        state.inputs.add(menuInput);

        let subMenus = new Map([
            ['main', MainMenu.create(engine, state)],
            ['multiplayer', MultiplayerMenu.create(engine, state)],
            ['options', OptionsMenu.create(state)],
            ['help', HelpMenu.create(state)]
        ]);

        for (let [subMenuName, subMenu] of subMenus.entries()) {
            state.addMenu(subMenuName, subMenu.menu);
        }

        let menuView = new MenuRenderView(state);

        for (let [subMenuName, subMenu] of subMenus.entries()) {
            menuView.addViewContainer(subMenuName, subMenu.viewContainer);
        }

        menuView.currentViewContainer = 'main';
        state.addView(menuView);

        state.currentMenu = 'main';
        state.audio = new MenuAudio(state, 'menu_effects', 'background');

        return state;
    }
};

export default MenuBuilder;
