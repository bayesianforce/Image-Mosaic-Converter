/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable flowtype/require-parameter-type */
class Tile {
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
        const x = col * this.width;
        const numPixCol = this.width * 4;
        const startCol = x * 4;
        let startPix = 0;

        for (let i = 0; i < this.height; i += 1) {
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
        const { pixels, numPixels } = this;

        /**
         *
         * @returns {Array}
         */
        function getAvgColor() {
            const tileSum = [0, 0, 0];
            let rgb;

            for (let pixIndex = 0; pixIndex < numPixels; pixIndex += 1) {
                rgb = pixels[pixIndex].subarray(pixIndex * 4, pixIndex * 4 + 3);
                for (let i = 0; i < 3; i += 1) {
                    tileSum[i] += rgb[i];
                }
            }

            return tileSum.map(avgComponent => {
                return avgComponent / numPixels || 0;
            });
        }

        function rgbToHex(tileAvg) {
            /**
             *
             * @param index
             * @returns {string}
             */
            function componentRgbToHex(index) {
                const hex = tileAvg[index].toString(16);
                return hex.length === 1 ? `0${hex}` : hex;
            }

            return componentRgbToHex(0) + componentRgbToHex(1) + componentRgbToHex(2);
        }

        this.color = rgbToHex(getAvgColor());
        return this;
    }
}

const start = data => {
    let dataPixels = [];
    const tileRows = [];
    const heightTile = data.TILE_HEIGHT;
    const widthTile = data.TILE_WIDTH;
    const numRow = data.rowNum;
    const numCol = data.colNum;
    const numPixels = data.pixelNum;
    const { dataCtx } = data;
    let startPixel = 0;
    let endPixel = 0;
    let tile = null;

    for (let row = 0; row < numRow; row += 1) {
        // loop rows
        startPixel = row * numPixels;
        endPixel = startPixel + numPixels;
        tileRows[row] = [];
        dataPixels = dataCtx.subarray(startPixel, endPixel); // extract pixels data foreach row. It's a matrix

        for (let col = 0; col < numCol; col += 1) {
            // loop columns
            tile = new Tile(widthTile, heightTile);
            tile.setTile(col, dataPixels).setAvgColor();
            tileRows[row].push({ color: tile.color });
        }
    }
    return { data: tileRows, type: 'MSG_COMPOSE_READY' };
};

const stop = () => {
    // eslint-disable-next-line no-restricted-globals
    self.close();
    return { data: '', type: '' };
};

const op = {
    MSG_START: start,
    MSG_STOP: stop,
};

// eslint-disable-next-line no-restricted-globals
self.onmessage = e => {
    try {
        const { data, type } = e.data;
        if (data) {
            this.postMessage(op[type].call(this, data));
        } else {
            this.close();
        }
    } catch (err) {
        this.postMessage({ data: '', type: 'MSG_ERROR' });
    }
};
/* eslint-enable flowtype/require-parameter-type */
/* eslint-enable flowtype/require-valid-file-annotation */
