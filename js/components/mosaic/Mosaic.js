// @flow
import MosaicRow from './MosaicRow';
import * as config from '../../config.json';

export default class Mosaic {
    constructor() {
        this.data = null;
        this.width = 0;
        this.height = 0;
        this.numRow = 0;
        this.indexRow = 0;

        this.canvas = document.querySelector('#mosaic-area');
        this.context = this.canvas.getContext('2d');
        this.dataCtx = [];
    }

    create($img: HTMLImageElement) {
        const $node = document.querySelector('#mosaic-box');
        const width = $node.offsetWidth;
        const ratio = $img.height / $img.width;
        const w = new Worker('js/components/mosaic/worker.js');

        // photo width > window width => resize image
        const img = $img;
        if (img.width > width) {
            img.width = width;
            img.height = Math.floor(width * ratio);
        }

        // set dimension
        this.width = img.width;
        this.height = img.height;
        this.numRow = this.height / config.TILE_HEIGHT;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // get pixel info from image and clean the rect
        this.context.drawImage(img, 0, 0, this.width, this.height);
        this.dataCtx = this.context.getImageData(0, 0, this.width, this.height).data;
        this.context.clearRect(0, 0, this.width, this.height);

        function msgCloseWorker() {
            return {
                data: '',
                type: 'MSG_STOP',
            };
        }

        w.postMessage({
            data: {
                colNum: Math.floor(this.width / config.TILE_WIDTH),
                rowNum: Math.floor(this.height / config.TILE_HEIGHT),
                pixelNum: config.TILE_HEIGHT * this.width * 4,
                dataCtx: this.dataCtx,
                TILE_HEIGHT: config.TILE_HEIGHT,
                TILE_WIDTH: config.TILE_WIDTH,
            },
            type: 'MSG_START',
        });

        w.onmessage = (e: *) => {
            const { data, type } = e.data;

            if (type === 'MSG_COMPOSE_READY') {
                this.data = data;
                this.render();
            } else {
                this.postMessage(msgCloseWorker());
            }
        };
        w.onerror = (err: string) => {
            // eslint-disable-next-line no-console
            console.log(err);
            msgCloseWorker();
        };
    }

    draw(canvas: *) {
        const startColumn = 0;
        const startRow = this.indexRow * config.TILE_HEIGHT;

        this.context.drawImage(canvas, startColumn, startRow);
    }

    render() {
        const newRow = new MosaicRow(this.width);
        newRow.fetch(this.data[this.indexRow]);

        Promise.all(newRow.row)
            .then((tilesLoaded: *) => {
                if (this.indexRow < this.numRow - 1) {
                    setTimeout(this.render(this.data[(this.indexRow += 1)]), 0);
                }
                newRow.draw(tilesLoaded);
                this.draw(newRow.canvas);
                newRow.context.clearRect(0, 0, this.width, config.TILE_HEIGHT);
            })
            .catch((err: string) => {
                // eslint-disable-next-line no-console
                console.log(err);
            });
    }
}
