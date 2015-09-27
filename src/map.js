
class Map {

    constructor () {
        this.layers = {};
        this.sprite = null;
    }

    preload () {
        game.load.tilemap('map_test', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tileset_test', 'assets/maps/tileset.png');
    }

    create () {
        // Sprite
        this.sprite = game.add.tilemap('map_test');
        this.sprite.addTilesetImage('main', 'tileset_test');

        // Layers
        this.layers.ground = this.sprite.createLayer('ground');
        this.layers.walls = this.sprite.createLayer('walls');

        // Adjust world size to 'ground' layer.
        this.layers.ground.resizeWorld();

        // World bounds
        game.physics.setBoundsToWorld(true, true, true, true, false);

        // Collision detection on entire 'walls' layer.
        this.sprite.setCollisionByExclusion([], true, this.layers.walls);

    }

    getLayers () {
        return this.layers;
    }

};

module.exports = Map;
