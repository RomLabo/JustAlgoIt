/**
 * Class Landmark
 * @author RomLabo
 * @class Landmark
 * @description Displays landmarks around the canvas on the screen.
 * Created on 07/02/2023.
 */
class Landmark {
    #canvas; #verticalLine;
    #horizontalLine;
    constructor(canvasId, verticalLineId, horizontalLineId) {
        this.#canvas = document.getElementById(canvasId);
        this.#verticalLine = document.getElementById(verticalLineId);
        this.#horizontalLine = document.getElementById(horizontalLineId);
    }
    display() {
        this.#canvas.addEventListener('mouseover', () => {
            // Display landmarks
            this.#canvas.addEventListener('mousemove', (a) => {
                this.#verticalLine.style.left = `${(a.clientX)}px`;
                this.#horizontalLine.style.top = `${(a.offsetY)}px`;
                this.#verticalLine.style.opacity = 1;
                this.#horizontalLine.style.opacity = 1;
            })
            // Hide landmarks
            this.#canvas.addEventListener('mouseleave', () => {
                this.#verticalLine.style.opacity = 0;
                this.#horizontalLine.style.opacity = 0;
            });
        });
    }
}