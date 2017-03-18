/**
 * Created by Valerio Bartolini
 */

export default class Photo {
  constructor() {
    this.data;
    this.width;
    this.height;
  }

  create(img) {
    this.data = img;
    this.width = img.width;
    this.height = img.height;
    return this;
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
