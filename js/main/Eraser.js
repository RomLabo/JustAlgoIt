export class Eraser {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.mouseDown = false;
    }
    erase() {
        this.context.fillStyle = "#161b22";
        this.canvas.addEventListener('mousedown', () => this.mouseDown = true)
        this.canvas.addEventListener('mouseup', () => this.mouseDown = false)
        this.canvas.addEventListener('mousemove', (a) => {
            if(this.mouseDown) {
                this.context.fillRect(a.offsetX, a.offsetY, 20, 20)
            }
        })
    }
}