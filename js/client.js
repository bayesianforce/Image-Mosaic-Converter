/**
 * Created by Valerio Bartolini
 */

window.onload = function () {
    var areaDrag = document.querySelector('.drag-area'),
        input = document.querySelector("#input"),
        inputHide = document.querySelector("#inputHide");

    areaDrag.addEventListener('dragover', function (evt) {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    }, false);

    input.addEventListener('click', function (evt) {
        evt.stopPropagation();
        inputHide.click();
    }, false);

    areaDrag.addEventListener('drop', function (evt) {
        evt.preventDefault();
        evt.dataTransfer.files[0] && evt.dataTransfer.files[0].type.match(/image.*/) && buildMosaic(evt.dataTransfer.files[0]);
    }, false);

    inputHide.addEventListener('change', function (evt) {
        evt.stopPropagation() && evt.preventDefault();
        this.files[0] && this.files[0].type.match(/image.*/) && buildMosaic(this.files[0]);
    }, false);
};
/**
 * Start process to turn an image in mosaic
 * @param file
 */
function buildMosaic(file) {
    var reader = new FileReader();
    file && reader.addEventListener("load", function () {
            var imgTemplate = new Image();
            imgTemplate.src = reader.result;
            imgTemplate.onload = function () {
                //create image from file
                var img = getImageResized(imgTemplate);
                //build mosaic
                var mosaic = new Mosaic().create(img, TILE_WIDTH, TILE_HEIGHT);
                //build mosaic process
                var w = new Worker(PATH_WORKER),
                    msg = {
                        colNum: mosaic.colNum, rowNum: mosaic.rowNum, pixelNum: mosaic.pixelNum, dataCtx: mosaic.dataCtx,
                        TILE_HEIGHT: TILE_HEIGHT, TILE_WIDTH: TILE_WIDTH
                    };

                mosaic && w && w.postMessage({data: msg, type: 'MSG_START'});
                w.onmessage = function (e) {
                    var msg = e.data,
                        data = msg.data,
                        type = msg.type;
                    switch (type) {
                        case MSG_ERROR:
                            this.postMessage(msgCloseWorker());
                            break;
                        case MSG_COMPOSE_READY: //It's called when the mosaic is built but not drawn
                            this.postMessage(msgSendRow());
                            break;
                        case MSG_ROW_READY: //It's called until the last row is drawn
                            render();
                            break;
                    }

                    /**
                     *  draw single tiles, put them in a hidden row and draw the result
                     */
                    function render() {
                        var mosaicRow = new MosaicRow();
                        mosaicRow
                            .setDimension((data.length * TILE_WIDTH), TILE_HEIGHT)
                            .preloadRow(data);
                        Promise.all(mosaicRow.row)
                            .then(function (tilesLoaded) {
                                w.postMessage(msgSendRow());
                                mosaic.drawRow(mosaicRow.drawTiles(tilesLoaded, TILE_WIDTH).canvas, TILE_HEIGHT);
                            })
                            .catch(function (err) {
                                console.log(err);
                            });
                    }
                };
                w.onerror = function (err) {
                    console.log(err);
                    msgCloseWorker();
                };
            }
        },
        false);
    reader.readAsDataURL(file);
}
/**
 * if images width are > of window then resize
 * @returns {*}
 */
function getImageResized(img) {
    var mosaicBox = document.querySelector('#mosaic-box'),
        width = mosaicBox.offsetWidth,
        ratio = img.height / img.width;

    if (img.width > width) {
        img.width = width;
        img.height = Math.floor(width * ratio);
    }
    return img;
}
/**
 *
 * @returns {{data: string, type: string}}
 */
function msgSendRow() {
    return {
        data: '', type: 'MSG_SEND_ROW'
    }
}

/**
 *
 * @returns {{data: string, type: string}}
 */
function msgCloseWorker() {
    return {
        data: '', type: 'MSG_STOP'
    }
}