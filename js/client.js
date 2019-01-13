/**
 * Created by Valerio Bartolini
 */
import App from './components/App.js';
import './App.css';

const options = {
  tile: {WIDTH: tiles.values().TILE_WIDTH, HEIGHT: tiles.values().TILE_HEIGHT},
  path: {
    SERVER: 'https://photomosaicool.herokuapp.com/color/'
  }
};

window.onload = () => {
  let photoMosaic = new App(options),
    areaDrag = document.querySelector('.drag-area'),
    input = document.querySelector('#input'),
    inputHide = document.querySelector('#inputHide');

  areaDrag.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, false);

  input.addEventListener('click', e => {
    e.stopPropagation();
    inputHide.click();
  }, false);

  areaDrag.addEventListener('drop', e => {
    e.preventDefault();
    let file = e.dataTransfer.files[0];
    file && file.type.match(/image.*/) && photoMosaic.loadFile(file);
  }, false);

  inputHide.addEventListener('change', e => {
    e.stopPropagation() && e.preventDefault();
    let file = e.target.files[0] || e.dataTransfer.files[0];
    file && file.type.match(/image.*/) && photoMosaic.loadFile(file);
  }, false);
};

