// @flow
import loadFile from './components/App';
import './App.css';

window.onload = () => {
    const input = document.querySelector('#input');
    const inputHide = document.querySelector('#inputHide');
    const getImage = (e: *) => e.target.files[0] || e.dataTransfer.files[0];

    input.addEventListener('click', (e: *) => {
        e.stopPropagation();
        inputHide.click();
    });

    inputHide.addEventListener('change', (e: *) => {
        e.stopPropagation();
        const file = getImage(e);
        return file && file.type.match(/image.*/) && loadFile(file);
    });
};
