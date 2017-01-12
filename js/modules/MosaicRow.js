/**
 * Created by Valerio Bartolini
 */

/**
 *
 * @constructor
 */
class MosaicRow {

    constructor() {
        /**
         *
         * @type {Array}
         */
        this.row = [];
        /**
         *
         * @type {Element}
         */
        this.canvas = document.createElement('canvas');
        /**
         *
         * @type {CanvasRenderingContext2D}
         */
        this.context = this.canvas.getContext('2d');
    }

    /**
     * set box canvas with image dimensions
     * @param width
     * @param height
     * @returns {MosaicRow}
     */

    setDimension(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;

        return this;
    };

    /**
     * loading images src and get svg from server
     * @param tiles
     * @returns {MosaicRow}
     */
    preloadRow(tiles) {
        for (var i = 0; i < tiles.length; i++) {
            this.row[i] = new Promise(function (resolve) {
                var img = new Image();
                img.onload = function () {
                    resolve(img);
                };
                img.src = URL_SERVER + tiles[i].color;
            });
        }
        return this;
    };

    /**
     * drawing images loaded during the preload phase
     * @param tiles
     * @param TILE_WIDTH
     * @returns {MosaicRow}
     */
    drawTiles(tiles, TILE_WIDTH) {
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i],
                x = i * TILE_WIDTH;
            this.context.drawImage(tile, x, 0);
        }
        return this;
    }
}

