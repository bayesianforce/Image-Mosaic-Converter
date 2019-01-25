/**
 * Created by Valerio Bartolini
 */
/** *******************************************************************************************
 Background process to manage tiles and elaborating each row of the image
 *********************************************************************************************/

/**
 *
 * @param e
 */
self.onmessage = function(e) {
    try {
        var eData = e.data,
            data = eData.data,
            type = eData.type;
        eData ? this.postMessage(op[type].call(this, data)) : this.close();
    } catch (err) {
        console.log(err);
        this.postMessage({ data: '', type: 'MSG_ERROR' });
    }
};

/**
 *
 * @param data
 * @returns {{data: Array, type: string}}
 */
function elaboration(data) {
    var dataPixels = [],
        tileRows = [],
        heightTile = data.TILE_HEIGHT,
        widthTile = data.TILE_WIDTH,
        numRow = data.rowNum,
        numCol = data.colNum,
        numPixels = data.pixelNum,
        dataCtx = data.dataCtx,
        start = 0,
        end = 0,
        tile = null;
    for (let row = 0; row < numRow; row++) {
        // loop rows
        start = row * numPixels;
        end = start + numPixels;
        tileRows[row] = [];
        dataPixels = dataCtx.subarray(start, end); // extract pixels data foreach row. It's a matrix

        for (let col = 0; col < numCol; col++) {
            // loop columns
            tile = new Tile(widthTile, heightTile);
            tile.setTile(col, dataPixels).setAvgColor();
            tileRows[row].push({ color: tile.color });
        }
    }
    return { data: tileRows, type: 'MSG_COMPOSE_READY' };
}

/**
 *
 * @returns {{data: string, type: string}}
 */
function stop() {
    self.close();
    return { data: '', type: '' };
}

/**
 *
 * @type {{MSG_START: elaboration, MSG_SEND_ROW: MSG_STOP: stop}}
 */
var op = {
    MSG_START: elaboration,
    MSG_STOP: stop,
};

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
        this.numPixels = 0;
    }

    /**
     * set coordinates of the tile matrix(each block have more pixels. Each pixel have 4 RGB color (R G B alpha))
     * @param col
     * @param ctxTile
     * @returns {Tile}
     */
    setTile(col, ctxTile) {
        var x = col * this.width,
            numPixCol = this.width * 4,
            startCol = x * 4,
            startPix = 0;

        for (let i = 0; i < this.height; i++) {
            startPix = startCol + i * numPixCol;
            this.pixels.push(ctxTile.subarray(startPix, startPix + numPixCol));
        }
        this.numPixels = Math.floor(this.pixels.length / this.height);
        return this;
    }

    /**
     *
     * @returns {Tile}
     */
    setAvgColor() {
        var pixels = this.pixels,
            numPixels = this.numPixels;

        /**
         *
         * @returns {Array}
         */
        function getAvgColor() {
            var tileSum = [0, 0, 0],
                rgb;

            for (let pixIndex = 0; pixIndex < numPixels; pixIndex++) {
                rgb = pixels[pixIndex].subarray(pixIndex * 4, pixIndex * 4 + 3);
                for (let i = 0; i < 3; i++) {
                    tileSum[i] += rgb[i];
                }
            }

            return tileSum.map(function(avgComponent) {
                return (avgComponent / numPixels) | 0;
            });
        }

        /**
         *
         * @param tileAvg
         * @returns {*}
         */
        function rgbToHex(tileAvg) {
            /**
             *
             * @param index
             * @returns {string}
             */
            function componentRgbToHex(index) {
                var hex = tileAvg[index].toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }

            return componentRgbToHex(0) + componentRgbToHex(1) + componentRgbToHex(2);
        }

        this.color = rgbToHex(getAvgColor());
        return this;
    }
}
