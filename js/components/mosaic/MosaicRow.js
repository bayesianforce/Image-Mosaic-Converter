/**
 * Created by Valerio Bartolini
 */

/**
 *
 * @constructor
 */
export default class MosaicRow {
  constructor(width, height, URL_SERVER) {
    this.row = [];
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = width;
    this.canvas.height = height;
    this.url = URL_SERVER;
  }

  /**
   * loading images src and get svg from server
   * @param tiles
   */
  fetch(tiles) {
    for (let i = 0; i < tiles.length; i++) {
      this.row[i] = new Promise((resolve) => {
        let img = new Image();
        img.onload = (e) => {
          resolve(e.target);
        };
        img.src = this.url + tiles[i].color;
      });
    }
  }

  /**
   * drawing images loaded during the preload phase
   * @param tiles
   * @param TILE_WIDTH
   */
  draw(tiles, TILE_WIDTH) {
    for (let i = 0; i < tiles.length; i++) {
      let dx = i * TILE_WIDTH;
      this.context.drawImage(tiles[i], dx, 0);
      tiles[i].src = '';
    }
  }
}
