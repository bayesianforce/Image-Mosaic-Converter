mosaic from image
-----------------
This app permit to select a local image and turn it on a mosaic.
Typically, the app loads that image, divides the image into tiles, computes the average color of each tile, and composites the  results into a photomosaic of the original image (row by row at the moment)
Performance are important and for this reason we need to maximize parallelism and asyncrony.

The tile size should be configurable via the code constants in js/mosaic.js.
The default size is 12x12.

## INSTALLATION
* npm install for development (npm install gulp if needed)
* gulp build
* digit npm start on the root of the project
* check the app on http://localhost:3000
