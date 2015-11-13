let debug = require('debug')('game:builders/states/menu-state');

import MenuState from '../../engine/states/menu/MenuState';
import MenuRenderView from '../../engine/states/menu/MenuRenderView';
import Menu from '../../engine/logic/menu/Menu';
import MenuInput from '../../engine/input/menu/MenuInput';

import MenuItemsView from '../../engine/views/menu/MenuItemsView';

let MenuStateBuilder = {
    create () {
        let menu = new Menu();

        let state = new MenuState(menu);

        let menuInput = new MenuInput(menu);
        let menuView = new MenuRenderView(menu);

        state.inputs.add(menuInput);

        // menuView.addStaticView(new MenuItemsView(menu));
        //
        state.addView(menuView);

        return state;
    }
};

export default MenuStateBuilder;
