import MainLoop from './utils/mainloop';

class ServerEngine {
    constructor () {
        this.state = null;
    }

    run () {
        const update = (delta) => {
            if (this.state) {
                this.state.update(delta);
            }
        };

        const loop = MainLoop.create().setUpdate(update);

        loop.start();
    }
}

export default ServerEngine;
