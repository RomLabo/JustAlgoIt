export class Color {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.colors = [[22, 27, 34], [255, 255, 255]];
    }
    invert() {
        let imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let data = imageData.data;
        let colors = data[0] === this.colors[0][0] ? this.colors : this.colors.reverse();
        for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] === colors[0][0] ? colors[1][0] : 255 - data[i]; 
            data[i + 1] = data[i + 1] === colors[0][1] ? colors[1][1] : 255 - data[i + 1];
            data[i + 2] = data[i + 2] === colors[0][2] ? colors[1][2] : 255 - data[i + 2]; 
        }
        this.context.putImageData(imageData, 0, 0);
    }
}