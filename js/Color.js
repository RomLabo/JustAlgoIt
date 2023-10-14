/*
0000000001 Author RomLabo
1000111000 Class Color
1000000001 Created on 05/11/2022.
1000100011111000000001100001110000
1000110001111000110001100010101000
0000011000011000000001100011011000
*/

/**
 * @class Color
 * @description Invert the values of the imgData array 
 * containing the rgb data, when the values match to this.color[0], 
 * then they are converted to this.color[1], when the valuesmatch 
 * to black or white it exchanges them.
 */
class Color {
    static BG_PIXEL_VALUE = 255;
    static CURRENT_BG_COLOR = {
        r: 22,
        g: 27,
        b: 34
    }
    
    /**
     * @description Converts black pixels to white 
     * and white pixels to black.
     * @param {ArrayBuffer} imgData 
     * @returns {ArrayBuffer} imgData
     */
    static invert(imgData) {
        if (typeof imgData !== undefined) {
            for (let i = 0; i < imgData.data.length; i += 4) {
                if ((imgData.data[i] === this.CURRENT_BG_COLOR.r) &&
                    (imgData.data[i+1] === this.CURRENT_BG_COLOR.g) &&
                    (imgData.data[i+2] === this.CURRENT_BG_COLOR.b)) {
                    
                    imgData.data[i] = this.BG_PIXEL_VALUE;
                    imgData.data[i+1] = this.BG_PIXEL_VALUE;
                    imgData.data[i+2] = this.BG_PIXEL_VALUE;
                } else {
                    imgData.data[i] = this.BG_PIXEL_VALUE - imgData.data[i];
                    imgData.data[i+1] = this.BG_PIXEL_VALUE - imgData.data[i+1];
                    imgData.data[i+2] = this.BG_PIXEL_VALUE - imgData.data[i+2];
                }
            }
            return imgData;
        }
    }
}