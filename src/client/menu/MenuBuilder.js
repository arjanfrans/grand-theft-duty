import MenuInput from './MenuInput';
import {MenuRenderView} from './views/MenuRenderView';
import MenuAudio from './MenuAudio';
import OptionsMenu from './menus/OptionsMenu';
import HelpMenu from './menus/HelpMenu';
import MainMenu from './menus/MainMenu';
import MenuState from './MenuState';

const MenuBuilder = {
    create (engine) {
        const state = new MenuState(engine);
        const menuInput = new MenuInput(engine.inputSources, state);

        state.addInput(menuInput);

        const subMenus = new Map([
            ['main', MainMenu.create(engine, state)],
            ['options', OptionsMenu.create(state)],
            ['help', HelpMenu.create(state)]
        ]);

        for (let [subMenuName, subMenu] of subMenus.entries()) {
            state.addMenu(subMenuName, subMenu.menu);
        }

        const menuView = new MenuRenderView(state);

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
