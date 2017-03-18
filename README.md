Remote Svg Mosaic
----------------
IT turn an image to mosaic downloading SVG from server.
Typical workflow: loads image, divides the image into tiles, computes the average color of each tile and composites the  results into a photomosaic row by row

The tile size should be configurable via the code constants in js/mosaic.js.
The default size is 10x10.


## INSTALLATION
* npm install
* digit npm start to run server
* check the app on http://localhost:3000
* npm run bundle to rebuild and watch
