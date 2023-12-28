/*
0000000001 Author RomLabo 111111111
1000111000 Class History 1111111111
1000000001 Created on 07/02/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class History
 * @description Stores the history 
 * of changes made on the canvas.
 */
class History {
    // Private properties
    #hData; #canvas;
    #context; #storageImgData;
    #currentImgData;

    /**
     * @param {Array<Shape>} allAgo
     * @param {String} idOfCanvas 
     */
    constructor(allAlgo, idOfCanvas) {
        this.allAlgo = allAlgo;
        this.cnv = document.getElementById(idOfCanvas);
        this.historyAlgo = [{ previous: [], forward: []}];
    }

    /**
     * 
     */
    update() {}

    /**
     * 
     */
    redo() {}
    
    /**
     * 
     */
    undo() {}
}