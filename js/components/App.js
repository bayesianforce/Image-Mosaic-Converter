/**
 * Created by Valerio Bartolini
 */
import Mosaic from './mosaic/Mosaic';
import Photo from './photo/Photo';

export default class App {
  constructor(options) {
    /**
     *
     * @param img
     */
    function start(img) {
      let photo = new Photo().create(img),
        res = photo.checkImage(options) && new Mosaic(options).create(photo);

      if (res === false) {
        console.log('wrong img dimension. width:' + img.width + ' and height: ' + img.height);
      }
    }

    /**
     *
     * @param file
     * @private
     */
    function loadFile(file) {
      let reader = new FileReader();
      file && reader.addEventListener('load', function(e) {
        let imgTemplate = new Image();
        imgTemplate.src = e.target.result;
        imgTemplate.onload = function() {
          start(imgTemplate);
        };
      }, false);
      reader.readAsDataURL(file);
    }

    let areaDrag = document.querySelector('.drag-area'),
      input = document.querySelector('#input'),
      inputHide = document.querySelector('#inputHide');

    areaDrag.addEventListener('dragover', function(evt) {
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy';
    }, false);

    input.addEventListener('click', function(evt) {
      evt.stopPropagation();
      inputHide.click();
    }, false);

    areaDrag.addEventListener('drop', function(evt) {
      evt.preventDefault();
      evt.dataTransfer.files[0] && evt.dataTransfer.files[0].type.match(/image.*/) && loadFile(evt.dataTransfer.files[0]);
    }, false);

    inputHide.addEventListener('change', function(evt) {
      evt.stopPropagation() && evt.preventDefault();
      this.files[0] && this.files[0].type.match(/image.*/) && loadFile(this.files[0]);
    }, false);
  }
}
