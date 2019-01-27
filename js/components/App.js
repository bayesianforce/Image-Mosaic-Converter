// @flow
import Mosaic from './mosaic/Mosaic';
import * as data from '../config.json';

const loadImage = (file: File) => {
    const fileReader = () => {
        return new Promise((resolve: ProgressEvent => void) => {
            const reader = new FileReader();
            reader.onload = resolve;
            reader.readAsDataURL(file);
        });
    };

    const isValidImage = img => img.width >= data.TILE_WIDTH && img.height >= data.TILE_HEIGHT;

    Promise.resolve()
        .then(() => fileReader())
        .then((e: ProgressEvent) => {
            const img: HTMLImageElement = new Image();

            img.onload = () => {
                const $container = document.querySelector('#mosaic-box');
                if ($container && isValidImage(img)) {
                    new Mosaic().create(img, $container);
                }
            };

            const fileRead = e.target;

            if (fileRead instanceof FileReader && typeof fileRead.result === 'string') {
                img.src = fileRead.result;
            }
        });
};

export default loadImage;
