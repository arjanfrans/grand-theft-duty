module.exports = {

    menuLabels: function () {
        var test = null;
        this.startLabel = game.add.text(80, 80, 'start', {
            font: '25px Arial', fill: '#dddddd' });

        this.startKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

        this.startKey.onDown.addOnce(function () {
            game.state.start('play');
        });

    },

    create: function(){
        this.menuLabels();
    },

    update: function(){
    //Game logic goes here
    },
};
