export class Color {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
    }
    invert() {
        let imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]; 
            data[i + 1] = 255 - data[i + 1]; 
            data[i + 2] = 255 - data[i + 2];
        }
        this.context.putImageData(imageData, 0, 0);
    }
}