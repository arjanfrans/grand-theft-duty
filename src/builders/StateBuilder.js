import MenuStateBuilder from './states/menu-state';

// TODO move it
import PlayStateBuilder from './play-state';

let StateBuilder = {
    PlayState: PlayStateBuilder,
    MenuState: MenuStateBuilder
};

export default StateBuilder;
