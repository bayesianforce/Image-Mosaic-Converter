/**
 * Created by Valerio Bartolini
 */
class Mosaic {
    /**
     *
     */
    constructor() {
        this.rowNum = 0;
        this.colNum = 0;
        this.pixelNum = 0;
        this.context = '';
        this.dataCtx = [];
        this.indexRow = 0;
        this.canvas = document.querySelector('#mosaic-area');
        this.context = this.canvas.getContext('2d');
    };

    /**
     *
     * @param img
     * @param TILE_WIDTH
     * @param TILE_HEIGHT
     * @returns {Mosaic}
     */
    create(img, TILE_WIDTH, TILE_HEIGHT) {
        img && img.width >= TILE_WIDTH && img.height >= TILE_HEIGHT ? this.create(img) : false;
        this.rowNum = Math.floor(img.height / TILE_HEIGHT);
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.context.drawImage(img, 0, 0, img.width, img.height);
        this.dataCtx = this.context.getImageData(0, 0, img.width, img.height).data;
        this.context.clearRect(0, 0, img.width, img.height);
        this.colNum = Math.floor(img.width / TILE_WIDTH);
        this.pixelNum = TILE_HEIGHT * img.width * 4;

        return this;
    };

    /**
     * draw rows and display them
     * @param canvasRow
     * @param TILE_HEIGHT
     * @returns {Mosaic}
     */
    drawRow(canvasRow,TILE_HEIGHT) {
        this.context.drawImage(canvasRow, 0, this.indexRow * TILE_HEIGHT);
        this.indexRow++;
        return this;
    };
}