<div align="center">
<h1>Photomosaic Filter</h1>

<a href="https://www.emojione.com/emoji/1f410">
<img height="80" width="80" alt="goat" src="https://raw.githubusercontent.com/kentcdodds/react-testing-library/master/other/goat.png" />
</a>

<p>Simple filter to convert an Image in Mosaic using a dedicated worker to process high computational calculations.</p>

[**More about Web Workesr**](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

</div>


<hr />

[**Here a demo of photomosaic**](https://photomosaicool.herokuapp.com/)

## How it works
----------------
Photomosaic turn an image to mosaic downloading SVG from server. You just need to load your image and wait for the result.
A dedicated woker is used to avoid UI freeze.

The tile size should be configurable via the code constants in js/config.json.
The default size is 10x10.

## Installation
* yarn start
* check the app on http://localhost:3000