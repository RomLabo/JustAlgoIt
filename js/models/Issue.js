export class Issue {
    constructor() {
        this.canvas = document.getElementById('main-canvas');
        this.modelCanvas = document.getElementById('model-canvas');
        this.context = this.canvas.getContext('2d');
        this.modelContext = this.modelCanvas.getContext('2d');
        this.form = document.getElementById('issue-form');
        this.data = document.getElementById('data');
        this.issueContent = document.getElementById('issue');
        this.result = document.getElementById('result');
        this.validIssue = document.getElementById('valid-issue');
        this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.brackets = new Image();
        this.brackets.src = "./assets/symboles.png";
        this.verticalLine = document.getElementById('vertical-line');
        this.horizontalLine = document.getElementById('horizontal-line');

        this.offsetTesxt = document.getElementById('offset');
        this.allIssues = [];
    }
    writeText() {
        this.validIssue.addEventListener('click', () => {
            this.modelContext.font = '16px arial';
            let maxDataBoxSizeX = 0;
            let wordDataArray;
            let newWordDataArray;
            if (this.data.value !== "") {
                wordDataArray = this.data.value.split(' ');
                if (wordDataArray.length > 3) {
                    newWordDataArray = wordDataArray.splice(0,3);
                    let j = 0;
                    for (let i = 0; i < wordDataArray.length; i++) {
                        j == 3 ? j = 1 : j++;
                        newWordDataArray[j-1] = newWordDataArray[j-1].concat('  ', wordDataArray[i]);
                    }
                    wordDataArray = newWordDataArray;
                }
                for (let i=0; i<wordDataArray.length; i++) {
                    if (this.modelContext.measureText(wordDataArray[i]).width > maxDataBoxSizeX) {
                        maxDataBoxSizeX = this.modelContext.measureText(wordDataArray[i]).width;
                    }
                }
            }

            let maxBoxSizeX = 0;
            let wordArray = this.issueContent.value.split('\n');
            for (let i=0; i<wordArray.length; i++) {
                if (this.modelContext.measureText(wordArray[i]).width > maxBoxSizeX) {
                    maxBoxSizeX = this.modelContext.measureText(wordArray[i]).width;
                }
            }

            let maxResultBoxSizeX = 0;
            let wordResultArray;
            let newWordResultArray;
            if (this.result.value !== "") {
                wordResultArray = this.result.value.split(' ');
                if (wordResultArray.length > 3) {
                    newWordResultArray = wordResultArray.splice(0,3);
                    let j = 0;
                    for (let i = 0; i < wordResultArray.length; i++) {
                        j == 3 ? j = 1 : j++;
                        newWordResultArray[j-1] = newWordResultArray[j-1].concat('  ', wordResultArray[i]);
                    }
                    wordResultArray = newWordResultArray;
                }
                for (let i=0; i<wordResultArray.length; i++) {
                    if (this.modelContext.measureText(wordResultArray[i]).width > maxResultBoxSizeX) {
                        maxResultBoxSizeX = this.modelContext.measureText(wordResultArray[i]).width;
                    }
                }
            }
            this.hideform();
            this.test(wordDataArray, maxDataBoxSizeX, wordArray, maxBoxSizeX, wordResultArray, maxResultBoxSizeX);
            // let issueModel = {
            //     coord: [0, 0],
            //     boxSize: [Math.round(maxDataBoxSizeX + 46), Math.round(maxBoxSizeX + 16), Math.round(maxResultBoxSizeX + 46)],
            //     boxHeigth: (16*wordArray.length+32),
            //     wordData: [wordDataArray, wordArray, wordResultArray]
            // }
            

            //this.placeIssue(wordDataArray, maxDataBoxSizeX, wordArray, maxBoxSizeX, wordResultArray, maxResultBoxSizeX);
        })
    }
    hideform() {
        this.form.style.zIndex = -5;
    }
    test(wordDataArray, maxDataBoxSizeX, wordArray, maxBoxSizeX, wordResultArray, maxResultBoxSizeX) {
        this.modelContext.fillStyle = "#ffffff";
        if (this.data.value !== "") {
            // Accolade ouvrante
            this.modelContext.drawImage(this.brackets, 0, 0, 23, 64,0, 16, 23, Math.round(16*wordArray.length+16));
            // Data
            console.log(Math.round((16*wordArray.length+16) / 2));
            for (let i=0; i<wordDataArray.length; i++) {
                this.modelContext.fillText(`${wordDataArray[i]}`,23,(36 - ((wordDataArray.length - 1) * 8)) + (i*16));
            }
            // Accolade fermante
            this.modelContext.drawImage(this.brackets, 23, 0, 23, 64, Math.round(maxDataBoxSizeX + 23), 16, 23, Math.round(16*wordArray.length+16));
        }
        // Sous problème
        this.modelContext.strokeStyle = "#ffffff";
        this.modelContext.strokeRect(Math.round(maxDataBoxSizeX + 49), 16, Math.round(maxBoxSizeX + 16), Math.round(16*wordArray.length+16));
        for (let i=0; i<wordArray.length; i++) {
            this.modelContext.fillText(`${wordArray[i]}`, Math.round(maxDataBoxSizeX + 57), 36+(i*16));
        }
        if (this.result.value !== "") {
            // Accolade ouvrante
            this.modelContext.drawImage(this.brackets, 0, 0, 23, 64, Math.round(maxDataBoxSizeX + maxBoxSizeX + 68), 16, 23, Math.round(16*wordArray.length+16));
            // Result
            for (let i=0; i<wordResultArray.length; i++) {
                this.modelContext.fillText(`${wordResultArray[i]}`, Math.round(maxDataBoxSizeX + maxBoxSizeX + 87), 20 +(i*16));
            }
            // Accolade fermante
            this.modelContext.drawImage(this.brackets, 23, 0, 23, 64, Math.round(maxDataBoxSizeX + maxBoxSizeX + maxResultBoxSizeX + 87), 16, 23, Math.round(16*wordArray.length+16));
        }
    }
    placeIssue(wordDataArray, maxDataBoxSizeX, wordArray, maxBoxSizeX, wordResultArray, maxResultBoxSizeX) {
        let mouseDown = false;
        this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.addEventListener('mousemove', (a) => {
            this.offsetTesxt.textContent = `${a.offsetX} , ${a.offsetY}`;
            if (!mouseDown) {
                this.context.fillStyle = "#161b22";
                this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.putImageData(this.imageData, 0, 0);
                
                // Trait de guidage
                this.verticalLine.style.left = `${((a.clientX + Math.round(maxBoxSizeX /2)) - Math.round(this.canvas.width / 2)) - 10}px`;
                this.verticalLine.style.height = `${this.canvas.height + 20}px`;
                this.horizontalLine.style.top = `${(a.offsetY - Math.round(this.canvas.height) - 32) + (8*wordArray.length) }px`;
                this.horizontalLine.style.width = `${this.canvas.width + 20}px`;
                
                this.context.fillStyle = "#ffffff";
                if (this.data.value !== "") {
                    // Accolade ouvrante
                    this.context.drawImage(this.brackets, 0, 0, 23, 64, a.offsetX - (57 + maxDataBoxSizeX) | 0, a.offsetY - 20, 23, 16*wordArray.length+16);
                    // Data
                    for (let i=0; i<wordDataArray.length; i++) {
                        this.context.fillText(`${wordDataArray[i]}`, a.offsetX - (31 + maxDataBoxSizeX), a.offsetY - 10 +(i*16));
                    }
                    // Accolade fermante
                    this.context.drawImage(this.brackets, 23, 0, 23, 64, a.offsetX - 31 | 0, a.offsetY - 20, 23, 16*wordArray.length+16);
                }
                // Sous problème
                this.context.strokeStyle = "#ffffff";
                this.context.strokeRect(a.offsetX - 8, a.offsetY - 20, maxBoxSizeX + 16, 16*wordArray.length+16);
                for (let i=0; i<wordArray.length; i++) {
                    this.context.fillText(`${wordArray[i]}`, a.offsetX, a.offsetY+(i*16));
                }
                if (this.result.value !== "") {
                    // Accolade ouvrante
                    this.context.drawImage(this.brackets, 0, 0, 23, 64, a.offsetX + (maxBoxSizeX + 8), a.offsetY - 20, 23, 16*wordArray.length+16);
                    // Result
                    for (let i=0; i<wordResultArray.length; i++) {
                        this.context.fillText(`${wordResultArray[i]}`, a.offsetX + (maxBoxSizeX + 31), a.offsetY - 10 +(i*16));
                    }
                    // Accolade fermante
                    this.context.drawImage(this.brackets, 23, 0, 23, 64, a.offsetX + (maxBoxSizeX + 31 + maxResultBoxSizeX), a.offsetY - 20, 23, 16*wordArray.length+16);
                }
            }
            this.canvas.addEventListener('click', () => {
                mouseDown = true;
                // Suppression trait de guidage
                this.verticalLine.style.left = 0;
                this.verticalLine.style.height = 0;
                this.horizontalLine.style.top = 0;
                this.horizontalLine.style.width = 0;
            });
        })
    }
    create() {
        this.form.style.zIndex = 3;
        this.writeText();
        this.issueContent.value = "";
        this.data.value = "";
        this.result.value = "";
    }
}