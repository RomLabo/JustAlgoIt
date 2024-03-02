/*
0000000001 Author RomLabo 111111111
1000111000 Class JDataStorage 11111
1000000001 Created on 12/11/2023 11
10001000111110000000011000011100001
10001100011110001100011000101010001
00000110000110000000011000110110001
*/

/**
 * @class JDataStorage
 * @description If local storage is available, 
 * save the algorithms in local storage so that 
 * they can be reloaded the next time the 
 * application is used.
 */
class JDataStorage {
    // Private properties
    #isAvailable; #data;
    
    constructor() {
        this.#isAvailable = this.isLocalStorageAvailable();
        this.#data = [];
    }

    get isAvailable() { return this.#isAvailable }

    get dataWereStored() { 
        if (this.isAvailable) {
            return localStorage.getItem("JustAlgoIt") != null;
        } else { return false }
    }

    get data() {
        if (this.dataWereStored) {
            return JSON.parse(localStorage.getItem("JustAlgoIt"));
        } else {
            console.log("no data");
            return [];
        }
    }

    /**
     * @description ....
     */
    isLocalStorageAvailable() {
        if (typeof localStorage != undefined) {
            try {
                localStorage.setItem("JustAlgoIt_storage_test", "test");
                if (localStorage.getItem("JustAlgoIt_storage_test")) {
                    localStorage.removeItem("JustAlgoIt_storage_test");
                    return true;
                } else { return false }
            } catch(e) { return false }
        } else { return false }
    }

    /**
     * @description ....
     */
    save(data) {
        if (this.isAvailable) {
            localStorage.setItem("JustAlgoIt", JSON.stringify(data));
        }
    }
}