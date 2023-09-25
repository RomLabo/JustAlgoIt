/**
 * Class Color
 * @author RomLabo
 * @class Color
 * @description Invert the values of the imgData array 
 *              containing the rgb data, when the values 
 *              match to this.color[0], then they are 
 *              converted to this.color[1], when the values
 *              match to black or white it exchanges them.
 * Created on 05/11/2022.
 */
class Color {
    #colors; #data;
    constructor() {
        this.#colors = [[22, 27, 34], [255, 255, 255]];
        this._data;
    }
    get data() {
        return this._data;
    }
    invert(imgData) {
        if (typeof imgData !== undefined) {
            let data = imgData.data;
            let colors = data[0] === this.#colors[0][0] ? this.#colors : this.#colors.reverse();
            for (let i = 0; i < data.length; i += 4) {
                data[i] = data[i] === colors[0][0] ? colors[1][0] : 255 - data[i]; 
                data[i + 1] = data[i + 1] === colors[0][1] ? colors[1][1] : 255 - data[i + 1];
                data[i + 2] = data[i + 2] === colors[0][2] ? colors[1][2] : 255 - data[i + 2]; 
            }
            this._data = imgData
            return imgData;
        }
    }
}