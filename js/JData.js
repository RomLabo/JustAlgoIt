/*
0000000001 Author RomLabo 111111111
1000111000 Class JData 111111111111
1000000001 Created on 06/07/2024 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JData
 * @description ...
 */
class JData {
    static reverseColor(imageData) {
        if (typeof imageData !== undefined) {
            for (let i = 0; i < imageData.data.length; i += 4) {
                if ((imageData.data[i] === 22) &&
                    (imageData.data[i+1] === 27) &&
                    (imageData.data[i+2] === 34)) {
                    
                    imageData.data[i] = 255;
                    imageData.data[i+1] = 255;
                    imageData.data[i+2] = 255;
                } else {
                    imageData.data[i] = 255 - imageData.data[i];
                    imageData.data[i+1] = 255 - imageData.data[i+1];
                    imageData.data[i+2] = 255 - imageData.data[i+2];
                }
            }
        }
    }

    static convertToString(key, node, imageSize) {
        return JSON.stringify({
            x:Math.round((node.x/imageSize.width)*100),
            y:Math.round((node.y/imageSize.height)*100), 
            t:node.type, tx:node.txt, o:node.output, i:key
        });
    }

    static convertToCodePoint(numbersArray, string) {
        for (let i = 0; i < string.length; i++) {
            numbersArray.push(string.codePointAt(i));
        }
        numbersArray.push(509);
    }

    static convertNumberToBinary(numbersArray, binariesArray) {
        for (let i = 0; i < numbersArray.length; i++) {
            for(let z = 0; z < 9; z++){
                binariesArray.push(numbersArray[i]%2);
                numbersArray[i]=numbersArray[i]/2|0;
            }
        }
    }

    static extractNumberFromImage(imageData, numbersArray) {
        let number = 0, end = false, i = 0, j = 0;

        while (j < imageData.length && !end) {
            if ((imageData[j] === 255 || imageData[j] === 254)
                && (imageData[j + 1] === 255 || imageData[j + 1] === 254)
                && (imageData[j + 2] === 255 || imageData[j + 2] === 254)) {
                number += (255 - imageData[j]) * (Math.pow(2, i));
                number += (255 - imageData[j + 1]) * (Math.pow(2, i + 1));
                number += (255 - imageData[j + 2]) * (Math.pow(2, i + 2));
                i += 3;
            }

            if (i % 9 === 0 && i !== 0) {
                if (number === 511) {
                    end = true;
                } else {
                    numbersArray.push(number);
                    number = 0;
                    i = 0;
                }
            }

            j += 4;
        }

        number = null; end = null; i = null; j = null;
    }

    static writeDataOnImageData(binariesArray, imageData) {
        let i = 0, g = 0;

        while (i < binariesArray.length && g < imageData.data.length -4) {
            if (imageData.data[g] === 255 
                && imageData.data[g + 1] === 255 
                && imageData.data[g + 2] === 255) {

                imageData.data[g] = imageData.data[g] - binariesArray[i];
                imageData.data[g + 1] = imageData.data[g + 1] - binariesArray[i + 1];
                imageData.data[g + 2] = imageData.data[g + 2] - binariesArray[i + 2];
                i += 3
            }
            g += 4;
        }

        i = null; g = null;
        return imageData;
    }

    static extractDataFromNumbersArray(numbersArray) {
        let data = [], string = ""; 

        for (let i = 0; i < numbersArray.length; i++) {
            if(numbersArray[i] === 509) {
                data.push(JSON.parse(string));
                string = "";
            } else {
                string += String.fromCodePoint(numbersArray[i]);
            }  
        }

        string = null;
        return data;
    }

    static save(imageData, imageSize, data) { 
        let numbersArray = [], binariesArray = [];       
        
        this.reverseColor(imageData);

        for (const [key,node] of data) {
            this.convertToCodePoint(numbersArray,
                                    this.convertToString(key, 
                                                         node, 
                                                         imageSize))
        }
        
        numbersArray.push(511);
        this.convertNumberToBinary(numbersArray, binariesArray);

        return this.writeDataOnImageData(binariesArray, imageData);
    }

    static load(imageData) {
        let numbersArray = [];
        this.extractNumberFromImage(imageData, numbersArray);
        return this.extractDataFromNumbersArray(numbersArray);
    }
}