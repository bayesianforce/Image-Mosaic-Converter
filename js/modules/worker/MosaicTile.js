/**
 * Created by Valerio Bartolini
 */

class Tile {
    /**
     *
     * @param TILE_WIDTH
     * @param TILE_HEIGHT
     */
    constructor(TILE_WIDTH, TILE_HEIGHT) {
        this.width = TILE_WIDTH;
        this.height = TILE_HEIGHT;
        this.color = '#000000';
        this.pixels = [];
        this.numPixels = 0
    }

    /**
     * set coordinates of the tile matrix(each block have more pixels. Each pixel have 4 RGB color (R G B alpha))
     * @param col
     * @param ctxTile
     * @returns {Tile}
     */
    setTile (col, ctxTile) {
        var x = col * this.width,
            numPixCol = this.width * 4,
            startCol = x * 4;

        for (var i = 0; i < this.height; i++) {
            var startPix = startCol + (i * numPixCol);
            this.pixels.push(ctxTile.subarray(startPix, startPix + numPixCol));
        }
        this.numPixels = Math.floor(this.pixels.length / this.height);
        return this;
    };

    /**
     *
     * @returns {Tile}
     */
    setAverageColor() {
        var pixels = this.pixels,
            numPixels = this.numPixels;

        /**
         *
         * @returns {Array}
         */
        function avgRgb() {
            var tileSum = [0, 0, 0];

            for (var pixIndex = 0; pixIndex < numPixels; pixIndex++) {
                var rgb = pixels[pixIndex].subarray(pixIndex * 4, pixIndex * 4 + 3);
                for (var i = 0; i < 3; i++) {
                    tileSum[i] += rgb[i];
                }
            }

            return tileSum.map(function (avgComponent) {
                return ( Math.ceil(avgComponent / numPixels)) | 0;
            });
        }

        /**
         *
         * @param tileAvg
         * @returns {*}
         */
        function rgbToHex(tileAvg) {
            return componentRgbToHex(tileAvg[0]) + componentRgbToHex(tileAvg[1]) + componentRgbToHex(tileAvg[2]);
        }

        /**
         *
         * @param component
         * @returns {string}
         */
        function componentRgbToHex(component) {
            var hex = component.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        this.color = rgbToHex(avgRgb());
        return this;
    };
}