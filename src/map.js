let Block = require('./engine/block');

class Map {
    constructor (width, height, depth, tileWidth, tileHeight, tileDepth) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileDepth = tileDepth;

        this.layers = [];

        let layer1 = [
            [1, 0, 0, 1, 1],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [1, 0, 0, 0, 1]
        ];

        // let layer2 = [
        //     [0, 1, 0, 0, 1],
        //     [0, 1, 1, 0, 0],
        //     [1, 1, 1, 1, 1],
        //     [1, 1, 0, 1, 1],
        //     [0, 0, 0, 1, 1]
        // ];

        layer1 = layer1.map((row) => {
            return row.map((col) => {
                if (col !== 0) {
                    return new Block(col);
                }

                return null;
            });
        });

        // FIXME Duplication
        // layer2 = layer2.map((row) => {
        //     return row.map((col) => {
        //         if (col !== 0) {
        //             return new Block(col);
        //         }
        //
        //         return null;
        //     });
        // });
        //
        //
        // this.layers.push(layer2);
        this.layers.push(layer1);
    }

    toString () {
        let finalString = '';

        for (let layer of this.layers) {
            let layerStrings = [];

            for (let layerRow of layer) {
                let tiles = layerRow.map(v => v ? v.id : 0);

                layerStrings.push(tiles.join(', '));
            }

            finalString = finalString.concat(layerStrings.join('\n'));
            finalString = finalString.concat('\n---------------\n');
        }

        return finalString;
    }
}

module.exports = Map;
