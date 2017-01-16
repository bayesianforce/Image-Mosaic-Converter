/**
 * Created by Valerio Bartolini
 */

export default class Photo {
  constructor(img) {
    this.data = img;
    this.width = img.width;
    this.height = img.height;
  }

  /**
   *
   * @param options
   * @returns {boolean}
   */
  checkImage(options) {
    return this.data && this.width >= options.tile.WIDTH && this.height >= options.tile.HEIGHT ? true : false;
  }
}
