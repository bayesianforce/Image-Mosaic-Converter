// @flow
import loadImage from './components/App';
import './index.css';

window.onload = () => {
    const input = document.querySelector('#input');
    const inputHide = document.querySelector('#inputHide');
    const getImage = (target: HTMLInputElement) => {
        const file = target.files[0];

        if (file && file.type.match(/image.*/)) {
            return file;
        }
        return null;
    };

    if (input) {
        input.addEventListener('click', (e: *) => {
            e.stopPropagation();
            if (inputHide) {
                inputHide.click();
            }
        });
    }

    if (inputHide) {
        inputHide.onchange = (e: Event) => {
            const { target } = e;
            if (target instanceof HTMLInputElement) {
                const image = getImage(target);
                if (image) {
                    loadImage(image);
                }
            }
        };
    }
};
