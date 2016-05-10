import MainLoop from './utils/mainloop';

class ServerEngine {
    constructor () {
        this.state = null;
    }

    run () {
        let update = (delta) => {
            if (this.state) {
                this.state.update(delta);
            }
        };

        let loop = MainLoop.create().setUpdate(update);

        loop.start();
    }
}

export default ServerEngine;
