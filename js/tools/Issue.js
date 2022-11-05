export class Issue {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.form = document.getElementById('issue-form');
        this.data = document.getElementById('data');
        this.issueContent = document.getElementById('issue');
        this.result = document.getElementById('result');
        this.validIssue = document.getElementById('valid-issue');
        this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.brackets = new Image();
        this.brackets.src = "./assets/symboles.png";
    }
    writeText() {
        this.validIssue.addEventListener('click', () => {
            this.context.font = '16px arial';
            let maxDataBoxSizeX = 0;
            let wordDataArray;
            if (this.data.value !== "") {
                wordDataArray = this.data.value.split(' ');
                for (let i=0; i<wordDataArray.length; i++) {
                    if (this.context.measureText(wordDataArray[i]).width > maxDataBoxSizeX) {
                        maxDataBoxSizeX = this.context.measureText(wordDataArray[i]).width;
                    }
                }
            }

            let maxBoxSizeX = 0;
            let wordArray = this.issueContent.value.split('\n');
            for (let i=0; i<wordArray.length; i++) {
                if (this.context.measureText(wordArray[i]).width > maxBoxSizeX) {
                    maxBoxSizeX = this.context.measureText(wordArray[i]).width;
                }
            }

            let maxResultBoxSizeX = 0;
            let wordResultArray;
            if (this.result.value !== "") {
                wordResultArray = this.result.value.split(' ');
                for (let i=0; i<wordResultArray.length; i++) {
                    if (this.context.measureText(wordResultArray[i]).width > maxResultBoxSizeX) {
                        maxResultBoxSizeX = this.context.measureText(wordResultArray[i]).width;
                    }
                }
            }
            this.hideform();
            this.placeIssue(wordDataArray, maxDataBoxSizeX, wordArray, maxBoxSizeX, wordResultArray, maxResultBoxSizeX);
        })
    }
    hideform() {
        this.form.style.zIndex = -5;
    }
    placeIssue(wordDataArray, maxDataBoxSizeX, wordArray, maxBoxSizeX, wordResultArray, maxResultBoxSizeX) {
        let mouseDown = false;
        this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.addEventListener('mousemove', (a) => {
            if (!mouseDown) {
                this.context.fillStyle = "#161b22";
                this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.putImageData(this.imageData, 0, 0);
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
            this.canvas.addEventListener('click', () => mouseDown = true);
        })
    }
    createIssue() {
        this.form.style.zIndex = 2;
        this.writeText();
        this.issueContent.value = "";
    }
}