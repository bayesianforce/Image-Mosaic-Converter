/**
 * Created by Valerio Bartolini
 */
import MosaicRow from './MosaicRow';

export default class Mosaic {
    constructor(options) {
        this.data = null;
        this.URL_SERVER = options.path.SERVER;
        this.TILE_WIDTH = options.tile.WIDTH;
        this.TILE_HEIGHT = options.tile.HEIGHT;
        this.width = 0;
        this.height = 0;
        this.numRow = 0;
        this.indexRow = 0;

        this.canvas = document.querySelector('#mosaic-area');
        this.context = this.canvas.getContext('2d');
        this.dataCtx = [];
    }

    /**
     *
     * @param img
     */
    create(img) {
        let $node = document.querySelector('#mosaic-box'),
            width = $node.offsetWidth,
            ratio = img.height / img.width,
            w = new Worker('js/components/mosaic/worker.js');

        // photo width > window width => resize image
        if (img.width > width) {
            img.width = width;
            img.height = Math.floor(width * ratio);
        }

        // set dimension
        this.width = img.width;
        this.height = img.height;
        this.numRow = this.height / this.TILE_HEIGHT;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // get pixel info from image and clean the rect
        this.context.drawImage(img, 0, 0, this.width, this.height);
        this.dataCtx = this.context.getImageData(0, 0, this.width, this.height).data;
        this.context.clearRect(0, 0, this.width, this.height);

        /**
         *
         * @returns {{data: string, type: string}}
         */
        function msgCloseWorker() {
            return {
                data: '',
                type: 'MSG_STOP',
            };
        }

        w.postMessage({
            data: {
                colNum: Math.floor(this.width / this.TILE_WIDTH),
                rowNum: Math.floor(this.height / this.TILE_HEIGHT),
                pixelNum: this.TILE_HEIGHT * this.width * 4,
                dataCtx: this.dataCtx,
                TILE_HEIGHT: this.TILE_HEIGHT,
                TILE_WIDTH: this.TILE_WIDTH,
            },
            type: 'MSG_START',
        });

        w.onmessage = e => {
            let eData = e.data,
                data = eData.data,
                type = eData.type;

            switch (type) {
                case 'MSG_ERROR':
                    this.postMessage(msgCloseWorker());
                    break;
                case 'MSG_COMPOSE_READY':
                    this.data = data;
                    this.render();
                    break;
                default:
                    break;
            }
        };
        w.onerror = function(err) {
            console.log(err);
            msgCloseWorker();
        };
    }

    /**
     * draw single tiles, put them in a hidden row and draw the result
     */
    render() {
        let row = new MosaicRow(this.width, this.TILE_HEIGHT, this.URL_SERVER);
        row.fetch(this.data[this.indexRow]);
        Promise.all(row.row)
            .then(tilesLoaded => {
                if (this.indexRow < this.numRow - 1) {
                    this.render(this.data[this.indexRow++]);
                }
                // console.time('draw');
                row.draw(tilesLoaded, this.TILE_WIDTH);
                // console.timeEnd('draw');
                this.draw(row.canvas, this.indexRow * this.TILE_HEIGHT);
                row.context.clearRect(0, 0, this.width, this.TILE_HEIGHT);
            })
            .catch(function(err) {
                console.log(err);
            });
    }

    /**
     * draw rows and display them
     * @param canvas
     * @param dy
     */
    draw(canvas, dy) {
        this.context.drawImage(canvas, 0, dy);
    }
}
