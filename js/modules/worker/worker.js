/**
 * Created by Valerio Bartolini
 */
/*********************************************************************************************
 Background process to manage tiles and elaborating each row of the image
 *********************************************************************************************/

importScripts("../conf/conf.js","MosaicTile.js");
/**
 *
 * @type {Array}
 */
var tileRows = [];

/**
 *
 * @type {{MSG_START: elaboration, MSG_SEND_ROW: sendRow, MSG_STOP: stop}}
 */
var op = {
    MSG_START: elaboration,
    MSG_SEND_ROW: sendRow,
    MSG_STOP: stop
};
/**
 *
 * @param e
 */
self.onmessage = function (e) {
    try {
        var msg = e.data,
            data = msg.data,
            type = msg.type;
        msg ? this.postMessage(op[type].call(this, data)) : this.close();
    }
    catch
        (err) {
        console.log(err);
        this.postMessage({data: '', type: MSG_ERROR});
    }
};

/**
 *
 * @param data
 * @returns {{data: string, type}}
 */
function elaboration(data) {
    var dataPixels = [],
        heightTile = data.TILE_HEIGHT,
        widthTile = data.TILE_WIDTH,
        numRow = data.rowNum,
        numCol = data.colNum,
        numPixels = data.pixelNum,
        dataCtx = data.dataCtx;

    for (var row = 0; row < numRow; row++) { //loop rows
        var index = row * numPixels;
        tileRows[row] = [];
        dataPixels = dataCtx.subarray(index, index + numPixels); //extract pixels data foreach column of the row. It's a matrix

        for (var col = 0; col < numCol; col++) { //loop columns
            var tile = new Tile(widthTile, heightTile);
            tile.setTile(col, dataPixels)
                .setAverageColor();
            tileRows[row].push({color: tile.color})
        }
    }
    return {data: '', type: MSG_COMPOSE_READY};
}
/**
 *
 * @returns {*}
 */
function sendRow() {
    var tileRow = tileRows[0];
    tileRows.shift();
    return tileRows.length ? {data: tileRow, type: MSG_ROW_READY} : false;
}
/**
 *
 * @returns {{data: string, type: string}}
 */
function stop() {
    self.close();

    return {data: '', type: ''};
}