// @flow
import * as config from '../../config.json';

export default class MosaicRow {
    constructor(width: number) {
        this.row = [];
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = config.TILE_HEIGHT;
        this.url = config.IMAGE_PATH;
    }

    fetch(tiles: *) {
        for (let i = 0; i < tiles.length; i += 1) {
            this.row[i] = new Promise((resolve: Promise<*>) => {
                const img = new Image();
                img.onload = (e: *) => {
                    resolve(e.target);
                };
                img.src = this.url + tiles[i].color;
            });
        }
    }

    draw(tiles: Array<*>) {
        for (let i = 0; i < tiles.length; i += 1) {
            const dx = i * config.TILE_WIDTH;
            this.context.drawImage(tiles[i], dx, 0);
            // eslint-disable-next-line no-param-reassign
            tiles[i].src = '';
        }
    }
}
