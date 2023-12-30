/*
0000000001 Author RomLabo 111111111
1000111000 Class JLandmark 11111111
1000000001 Created on 07/02/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JLandmark
 * @description Displays landmarks 
 * around the canvas on the screen.
 */
class JLandmark {
    // Private properties
    #canvas; #verticalLandmark;
    #horizontalLandmark;

    /**
     * @param {String} idOfCanvas 
     * @param {String} idOfVerticalLandmark 
     * @param {String} idOfHorizontalLandmark 
     */
    constructor(idOfCanvas, idOfVerticalLandmark, idOfHorizontalLandmark) {
        this.#canvas = document.getElementById(idOfCanvas);
        this.#verticalLandmark = document.getElementById(idOfVerticalLandmark);
        this.#horizontalLandmark = document.getElementById(idOfHorizontalLandmark);
    }
    
    /**
     * @description display landmarks when 
     * the user's mouse hovers over the canvas.
     */
    display(e) {
        this.#verticalLandmark.style.left = `${(e.clientX)}px`;
        this.#horizontalLandmark.style.top = `${(e.offsetY)}px`;
        this.#verticalLandmark.style.opacity = 1;
        this.#horizontalLandmark.style.opacity = 1;
    }

    /**
     * @description hides the markers 
     * when the mouse leaves the canvas area.
     */
    hide() {
        this.#verticalLandmark.style.opacity = 0;
        this.#horizontalLandmark.style.opacity = 0;
    }

    /**
     * @description Initialise landmarks by starting 
     * the "mouseover" event handler on the canvas, 
     * to show or hide landmarks.
     */
    init() {
        this.#canvas.addEventListener('mouseover', () => {
            this.#canvas.addEventListener('mousemove', (e) => {
                this.display(e);
            })
            this.#canvas.addEventListener('mouseleave', () => {
                this.hide();
            });
        });
    }
}