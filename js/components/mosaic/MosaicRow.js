/**
 * Created by Valerio Bartolini
 */

/**
 *
 * @constructor
 */
export default class MosaicRow {
  constructor() {
    this.row = [];
    this.canvas = document.createElement('canvas');
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
  }

  /**
   * loading images src and get svg from server
   * @param tiles
   * @returns {MosaicRow}
   */
  preload(tiles, URL_SERVER) {
    for (let i = 0; i < tiles.length; i++) {
      this.row[i] = new Promise(function(resolve) {
        var img = new Image();
        img.onload = function() {
          resolve(img);
        };
        img.src = URL_SERVER + tiles[i].color;
      });
    }
    return this;
  }

  /**
   * drawing images loaded during the preload phase
   * @param tiles
   * @param TILE_WIDTH
   * @returns {MosaicRow}
   */
  draw(tiles, TILE_WIDTH) {
    for (let i = 0; i < tiles.length; i++) {
      this.context.drawImage(tiles[i], i * TILE_WIDTH, 0);
    }
    return this.canvas;
  }
}
