/*
0000000001 Author RomLabo
1000111000 Class DataStorage
1000000001 Created on 12/11/2023.
1000100011111000000001100001110000
1000110001111000110001100010101000
0000011000011000000001100011011000
*/

/**
 * @class DataStorage
 * @description If local storage is available, 
 * save the algorithms in local storage so that 
 * they can be reloaded the next time the 
 * application is used.
 */
class DataStorage {
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