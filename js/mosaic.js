// Constants shared between client and server.
var TILE_WIDTH = 14,
  TILE_HEIGHT = 14;

(function(exports) {
  exports.values = function() {
    return {TILE_WIDTH: TILE_WIDTH, TILE_HEIGHT: TILE_HEIGHT};
  };
}(typeof exports === 'undefined' ? this.tiles = {} : exports));
