export let layers = {};
let _sprite = null;

export let preload = function () {
    game.load.tilemap('map_test', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset_test', 'assets/maps/spritesheet.png');
};

export let create = function () {
    // Sprite
    _sprite = game.add.tilemap('map_test');
    _sprite.addTilesetImage('main', 'tileset_test');

    // Layers
    layers.ground = _sprite.createLayer('ground');
    layers.walls = _sprite.createLayer('walls');

    // Adjust world size to 'ground' layer.
    layers.ground.resizeWorld();

    // World bounds
    game.physics.setBoundsToWorld(true, true, true, true, false);

    // Collision detection on entire 'walls' layer.
    _sprite.setCollisionByExclusion([], true, layers.walls);
};

export let update = function () {
    game.physics.arcade.collide(bulletPool.getBullets(), map.layers.walls, bulletWallCollisionHandler)
};


