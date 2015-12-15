import Menu from '../../engine/menu-system/Menu';
import MenuItem from '../../engine/menu-system/MenuItem';
import BackgroundView from '../../engine/graphics/BackgroundView';
import ViewContainer from '../../engine/graphics/ViewContainer';
import MenuItemsView from './views/MenuItemsView';

let HelpMenu = {
    create (menuState) {
        let menu = new Menu();
        let viewContainer = new ViewContainer();

        menu.addMenuItem(new MenuItem('back', '- back', function () {
            menuState.currentMenu = 'main';
        }));

        viewContainer.addDynamicView(new MenuItemsView(menu), { x: 300, y: 100, z: 0 });

        let background = new BackgroundView('iwo_jima', 'ui');

        background.lightness = 0.5;

        viewContainer.backgroundView = background;

        return {
            viewContainer: viewContainer,
            menu: menu
        };
    }
};

export default HelpMenu;
