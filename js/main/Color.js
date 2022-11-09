export class Color {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
    }
    lighten() {
        let imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] === 22 ? 255 : 255 - data[i]; 
            data[i + 1] = data[i + 1] === 27 ? 255 : 255 - data[i + 1];
            data[i + 2] = data[i + 2] === 34 ? 255 : 255 - data[i + 2]; 
        }
        this.context.putImageData(imageData, 0, 0);
    }
}