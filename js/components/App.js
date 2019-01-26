// @flow
import Mosaic from './mosaic/Mosaic';
import * as data from '../config.json';

const loadFile = (file: *) => {
    const fileReader = () => {
        return new Promise((resolve: Promise<*>) => {
            const reader = new FileReader();
            reader.onload = resolve;
            reader.readAsDataURL(file);
        });
    };

    Promise.resolve()
        .then(() => fileReader())
        .then((e: Event<FileReader>) => {
            const img: HTMLImageElement = new Image();
            img.onload = () => {
                if (img.width >= data.TILE_WIDTH && img.height >= data.TILE_HEIGHT) {
                    new Mosaic().create(img);
                }
            };

            const fileRead = e.target;
            img.src = fileRead.result;
        });
};

export default loadFile;
