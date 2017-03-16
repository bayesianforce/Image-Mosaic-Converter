/**
 * Created by Valerio Bartolini
 */
import MosaicRow from './MosaicRow';

export default class Mosaic {
  constructor(options) {
    this.width = 0;
    this.height = 0;
    this.area = null;
    this.context = '';
    this.dataCtx = [];
    this.indexRow = 0;
    this.canvas = document.querySelector('#mosaic-area');
    this.context = this.canvas.getContext('2d');
    this.URL_SERVER = options.path.SERVER;
    this.TILE_WIDTH = options.tile.WIDTH;
    this.TILE_HEIGHT = options.tile.HEIGHT;
    this.messages = options.messages;
  }

  /**
   *
   * @param img
   * @returns {Mosaic}
   */
  create(img) {
    var $node = document.querySelector('#mosaic-box'),
      width = $node.offsetWidth,
      ratio = img.height / img.width,
      self = this,
      w = new Worker('js/modules/mosaic/worker.js');

    // photo width > window width => resize image
    if (img.width > width) {
      img.width = width;
      img.height = Math.floor(width * ratio);
    }

    // set dimension
    this.width = img.width;
    this.height = img.height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // get pixel info from image and clean the rect
    this.context.drawImage(img.data, 0, 0, this.width, this.height);
    this.dataCtx = this.context.getImageData(0, 0, this.width, this.height).data;
    this.context.clearRect(0, 0, this.width, this.height);

    var postData = {
      colNum: Math.floor(this.width / this.TILE_WIDTH),
      rowNum: Math.floor(this.height / this.TILE_HEIGHT),
      pixelNum: this.TILE_HEIGHT * this.width * 4,
      dataCtx: this.dataCtx,
      TILE_HEIGHT: this.TILE_HEIGHT,
      TILE_WIDTH: this.TILE_WIDTH
      };

    /**
     *
     * @returns {{data: string, type: string}}
     */
    function msgCloseWorker() {
      return {
        data: '', type: 'MSG_STOP'
      };
    }

    w.postMessage({data: postData, type: 'MSG_START'});
    w.onmessage = function(e) {
      var eData = e.data,
        data = eData.data,
        type = eData.type;

      switch (type) {
        case 'MSG_ERROR':
          this.postMessage(msgCloseWorker());
          break;
        case 'MSG_COMPOSE_READY': // It's called when the mosaic process is completed
          self.area = data;
          addRow();
          break;
        default:
          break;
      }

      /**
       *  draw single tiles, put them in a hidden row and draw the result
       */
      function render() {
        var mosaicRow = new MosaicRow();
        mosaicRow
          .setDimension(self.width, self.TILE_HEIGHT)
          .preload(self.area[self.indexRow], self.URL_SERVER);
        Promise.all(mosaicRow.row)
          .then(function(tilesLoaded) {
            addRow();
            self.draw(mosaicRow.draw(tilesLoaded, self.TILE_WIDTH).canvas);
          })
          .catch(function(err) {
            console.log(err);
          });
      }

      function addRow() {
        render();
      }
    };
    w.onerror = function(err) {
      console.log(err);
      msgCloseWorker();
    };
  }

  /**
   * draw rows and display them
   * @param row
   * @returns {Mosaic}
   */
  draw(row) {
    this.context.drawImage(row, 0, this.indexRow * self.TILE_HEIGHT);
    this.indexRow++;
    return this;
  }
}
