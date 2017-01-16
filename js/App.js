/**
 * Created by Valerio Bartolini
 */
import Mosaic from './modules/mosaic/Mosaic';
import Photo from './modules/photo/Photo';
class App {
  constructor(options) {
    /**
     *
     * @param img
     */
    function start(img) {
      var photo = new Photo(img);
      photo.checkImage(options) && new Mosaic(options).create(photo).convert();
    }

    /**
     *
     * @param file
     * @private
     */
    function loadFile(file) {
      var reader = new FileReader();
      file && reader.addEventListener('load', function(e) {
        var imgTemplate = new Image();
        imgTemplate.src = e.target.result;
        imgTemplate.onload = start(imgTemplate);
      }, false);
      reader.readAsDataURL(file);
    }

    var areaDrag = document.querySelector('.drag-area'),
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
module.exports = App;
