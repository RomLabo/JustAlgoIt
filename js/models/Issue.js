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
        this.previewImageData;
        this.brackets = new Image();
        this.brackets.src = "./assets/symboles.png";
        this.verticalLine = document.getElementById('vertical-line');
        this.horizontalLine = document.getElementById('horizontal-line');

        this.offsetTesxt = document.getElementById('offset');
        this.allIssues = [];

        this.modelImg = new Image();

        this.clickArea = [];
        this.issueSize = [];
    }
    get issueParams() {
        return [this.issueSize,this.clickArea];
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
        })
    }
    hideform() {
        this.form.style.zIndex = -5;
    }
    test(wordDataArray, maxDataBoxSizeX, wordArray, maxBoxSizeX, wordResultArray, maxResultBoxSizeX) {
        this.modelContext.clearRect(0, 0, this.modelCanvas.width, this.modelCanvas.height);
        this.modelContext.fillStyle = "#ffffff";
        if (this.data.value !== "") {
            // Accolade ouvrante
            this.modelContext.drawImage(this.brackets, 0, 0, 23, 64,0, 16, 23, Math.round(16*wordArray.length+16));
            // Data
            for (let i=0; i<wordDataArray.length; i++) {
                this.modelContext.fillText(`${wordDataArray[i]}`,23,(Math.round((16*wordArray.length+16)/2) + 28) - (wordDataArray.length * 8) + (i*16));
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
                this.modelContext.fillText(`${wordResultArray[i]}`, Math.round(maxDataBoxSizeX + maxBoxSizeX + 87), (Math.round((16*wordArray.length+16)/2) + 28) - (wordResultArray.length * 8) + (i*16));
            }
            // Accolade fermante
            this.modelContext.drawImage(this.brackets, 23, 0, 23, 64, Math.round(maxDataBoxSizeX + maxBoxSizeX + maxResultBoxSizeX + 87), 16, 23, Math.round(16*wordArray.length+16));
        }

        // Creation issueParams
        this.issueSize = [Math.round(maxDataBoxSizeX + maxBoxSizeX + maxResultBoxSizeX + 110), Math.round(16*wordArray.length+16) + 32];
        this.clickArea = [[Math.round(maxDataBoxSizeX + 49), Math.round(maxDataBoxSizeX + maxBoxSizeX + 65)],[16, Math.round(16*wordArray.length+16) +16]];
        // Récupération model issue
        this.imageData = this.modelContext.getImageData(0, 0, this.issueSize[0], this.issueSize[1]);
        
        // Transfere vers main canvas
        this.context.putImageData(this.imageData, 0, 0);
        // Effacement modelCanvas
        // this.modelContext.fillStyle = "#161b22";
        

        this.canvas.addEventListener('mousedown', (e) => {
            let mouseDown = true;
            
            if ((e.offsetX >= this.clickArea[0][0] && e.offsetX <= this.clickArea[0][1]) && (e.offsetY >= this.clickArea[1][0] && e.offsetY <= this.clickArea[1][1])) {
                this.canvas.addEventListener('mousemove', (a) => {
                    if (mouseDown) {
                        this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
                        this.context.putImageData(this.previewImageData, 0, 0);
                        // Trait de guidage
                        this.verticalLine.style.left = `${((a.clientX + (Math.round(this.issueSize[0] / 2)))) - Math.round(this.canvas.width / 2) - 10}px`;
                        this.verticalLine.style.height = `${this.canvas.height + 20}px`;
                        this.horizontalLine.style.top = `${(a.offsetY - Math.round(this.canvas.height) - 32) + (Math.round(this.issueSize[1] / 2)) }px`;
                        this.horizontalLine.style.width = `${this.canvas.width + 20}px`;
                        
                        this.context.putImageData(this.imageData, a.offsetX, a.offsetY);
                        this.clickArea[0] = [this.clickArea[0][0] + a.offsetX, this.clickArea[0][1] + a.offsetX];
                        this.clickArea[1] = [this.clickArea[1][0] + a.offsetY, this.clickArea[1][1] + a.offsetY];
                    }
                    this.canvas.addEventListener('mouseup', () => {
                        mouseDown = false;
                        // Suppression trait de guidage
                        this.verticalLine.style.left = 0;
                        this.verticalLine.style.height = 0;
                        this.horizontalLine.style.top = 0;
                        this.horizontalLine.style.width = 0;
                    });
                })
            }
        })
    }
    create() {
        this.previewImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.form.style.zIndex = 3;
        this.writeText();
        this.issueContent.value = "";
        this.data.value = "";
        this.result.value = "";
    }
}