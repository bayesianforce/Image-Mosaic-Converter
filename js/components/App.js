/**
 * Created by Valerio Bartolini
 */
import Mosaic from './mosaic/Mosaic';

export default class App {
  constructor(options) {
    this.options = options;
  }

  /**
   *
   * @param img
   */
  start(img) {
    img && img.width >= this.options.tile.WIDTH && img.height >= this.options.tile.HEIGHT ?
      new Mosaic(this.options).create(img) :
      console.log('wrong img dimension. width:' + img.width + ' and height: ' + img.height);
  }

  /**
   *
   * @param file
   */
  loadFile(file) {
    let fileReader = () => {
      return new Promise((resolve) => {
        let reader = new FileReader();
        reader.onload = resolve;
        reader.readAsDataURL(file);
      });
    };

    Promise.resolve()
      .then(() => fileReader())
      .then((e) => {
        const img = new Image();
        img.onload = () => {
          this.start(img);
        };
        img.src = e.target.result;
      });
  }
}
