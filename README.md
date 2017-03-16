Remote Svg Mosaic
----------------
IT turn an image to mosaic downloading SVG from server.
Typical workflow: loads image, divides the image into tiles, computes the average color of each tile and composites the  results into a photomosaic row by row

The tile size should be configurable via the code constants in js/mosaic.js.
The default size is 7x7.


## INSTALLATION
* npm install for development (npm install -g gulp-cli if needed)
* gulp build
* digit npm start on the root of the project
* check the app on http://localhost:3000