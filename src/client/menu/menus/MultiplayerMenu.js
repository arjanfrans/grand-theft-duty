import Menu from '../../../engine/menu-system/Menu';
import MenuItem from '../../../engine/menu-system/MenuItem';
import MenuInputItem from '../../../engine/menu-system/MenuInputItem';
import BackgroundView from '../../../engine/graphics/BackgroundView';
import ViewContainer from '../../../engine/graphics/ViewContainer';
import MenuItemsView from '../views/MenuItemsView';
import PlayBuilder from '../../play/PlayBuilder';

const Multiplayer = {
    create (engine, menuState) {
        const menu = new Menu();
        const viewContainer = new ViewContainer();

        menu.addMenuItem(new MenuInputItem('server', 'Server', 'localhost:3000', function (value) {
            menuState.changeOption('server', value);
        }));

        menu.addMenuItem(new MenuItem('connect', 'Connect', function () {
            // Do not allow navigation in the menu while loading
            menu.freeze = true;

            const options = {
                url: menuState.options.get('server'),
                playerName: menuState.options.get('name'),
                poolSize: 200
            };

            PlayBuilder.createMultiplayer(engine, options).then((multiplayerState) => {
                menu.freeze = false;
                engine.addState('multiplayer', multiplayerState);

                engine.changeState('multiplayer');
            }).catch((err) => {
                console.error('Error creating multiplayer game');
                console.error(err);
            });
        }));

        menu.addMenuItem(new MenuItem('back', '- back', function () {
            menuState.currentMenu = 'main';
        }));

        viewContainer.addDynamicView(new MenuItemsView(menu), { x: 300, y: 100, z: 0 });

        const background = new BackgroundView('front', 'ui');

        background.lightness = 0.8;

        viewContainer.backgroundView = background;

        return {
            viewContainer: viewContainer,
            menu: menu
        };
    }
};

export default Multiplayer;
