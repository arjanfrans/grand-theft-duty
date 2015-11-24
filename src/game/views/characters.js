let debug = require('debug')('game:engine/views/characters');

import ObjectPool from '../../engine/utils/ObjectPool';

// TODO make an character view
import PlayerView from './player';
import View from '../../engine/views/View';

class CharactersView extends View {
    constructor (characters) {
        super();

        this.characters = characters;

        this.viewPool = new ObjectPool(() => {
            return new PlayerView(null);
        }, this.characters.size, 10);

        this.viewPairs = new WeakMap();
    }

    init () {
        this.mesh = new THREE.Object3D();
        this._initialized = true;
    }

    update (interpolationPercentage) {
        // Keep viewPool in sync with character pool
        if (this.viewPool.poolSize > this.characters.length) {
            this.viewPool.allocate(this.characters.length - this.viewPool.size);
        }

        for (let character of this.characters) {
            let view = this.viewPairs.get(character);

            if (!view && !character.dead) {
                view = this.viewPool.get();

                view.player = character;
                view.init();

                // Team is set after, because it affects the material
                view.team = character.team;

                this.mesh.add(view.mesh);

                this.viewPairs.set(character, view);
            } else if (view) {
                view.update(interpolationPercentage);

                if (character.dead && this.viewPairs.has(character)) {
                    this.viewPool.free(view);
                    this.viewPairs.delete(character);
                }
            }
        }
    }
}

export default CharactersView;
