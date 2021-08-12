import MenuInput from "./MenuInput";
import { MenuRenderView } from "./views/MenuRenderView";
import MenuAudio from "./MenuAudio";
import OptionsMenu from "./menus/OptionsMenu";
import HelpMenu from "./menus/HelpMenu";
import MainMenu from "./menus/MainMenu";
import { MenuState } from "./MenuState";
import { AudioUpdateSystem } from "../update-system/AudioUpdateSystem";
import { ControllerUpdateSystem } from "../../engine/system/ControllerUpdateSystem";

const MenuBuilder = {
    create(engine) {
        const state = new MenuState(engine);

        const subMenus = new Map([
            ["main", MainMenu.create(engine, state)],
            ["options", OptionsMenu.create(state)],
            ["help", HelpMenu.create(state)],
        ]);

        for (let [subMenuName, subMenu] of subMenus.entries()) {
            state.addMenu(subMenuName, subMenu.menu);
        }

        const menuView = new MenuRenderView(state);

        for (let [subMenuName, subMenu] of subMenus.entries()) {
            menuView.addViewContainer(subMenuName, subMenu.viewContainer);
        }

        menuView.currentViewContainer = "main";
        state.addView(menuView);

        state.currentMenu = "main";

        state.addSystem(
            new ControllerUpdateSystem([
                new MenuInput(engine.inputSources, state),
            ]),
            0
        );
        state.addSystem(
            new AudioUpdateSystem(
                new MenuAudio(state, "menu_effects", "background")
            ),
            1
        );

        return state;
    },
};

export default MenuBuilder;
