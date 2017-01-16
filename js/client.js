/**
 * Created by Valerio Bartolini
 */
const options = {
  tile: {WIDTH: tiles.values().TILE_WIDTH, HEIGHT: tiles.values().TILE_HEIGHT},
  path: {
    SERVER: 'http://localhost:3000/color/'
  }
};

window.onload = function() {
  new Mosaic.App(options);
};
