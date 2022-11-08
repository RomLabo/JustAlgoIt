export class Landmark {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.verticalLine = document.getElementById('vertical-line');
        this.horizontalLine = document.getElementById('horizontal-line');
    }
    display() {
        let mouseDown = false;
        this.canvas.addEventListener('mousemove', (a) => {
            // Display landmarks
            if (!mouseDown) {
                this.verticalLine.style.left = `${(a.clientX - Math.round(this.canvas.width / 2)) - 10}px`;
                this.verticalLine.style.height = `${this.canvas.height + 20}px`;
                this.horizontalLine.style.top = `${(a.offsetY - Math.round(this.canvas.height) - 32)}px`;
                this.horizontalLine.style.width = `${this.canvas.width + 20}px`;
            }
            // Hide landmarks
            this.canvas.addEventListener('click', () => {
                mouseDown = true;
                this.verticalLine.style.left = 0;
                this.verticalLine.style.height = 0;
                this.horizontalLine.style.top = 0;
                this.horizontalLine.style.width = 0;
            });
        });
    }
}