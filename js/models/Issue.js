export class Issue {
    constructor() {
        this.canvas = document.getElementById('main-canvas');
        this.modelCanvas = document.getElementById('model-canvas');
        this.context = this.canvas.getContext('2d');
        this.modelContext = this.modelCanvas.getContext('2d');
        this.modelContext.font = '16px arial';

        this.form = document.getElementById('issue-form');
        this.data = document.getElementById('data');
        this.issueContent = document.getElementById('issue');
        this.result = document.getElementById('result');
        this.validIssue = document.getElementById('valid-issue');
        this.imageData;

        this.brackets = new Image();
        this.brackets.src = "./assets/symboles.png";
        this.bracketsParam = {size: [23, 64], leftPos: [0, 0], rightPos: [23, 0]};

        this.verticalLine = document.getElementById('vertical-line');
        this.horizontalLine = document.getElementById('horizontal-line');

        this.allIssueData = [];


        this.clickArea = [];
        this.issueSize = [];
    }
    get issueParams() {
        return [this.issueSize,this.clickArea];
    }
    hideform() {
        this.form.style.zIndex = -5;
    }
    getFormText() {
        this.validIssue.addEventListener('click', () => {
            let textSize = [0, 0, 0];
            let textCopy = [];
            let allFormText = [
                this.data.value.split(' '),
                this.result.value.split(' '),
                this.issueContent.value.split('\n')
            ]
            for (let i = 0; i < 2; i++) {
                if (allFormText[i].length > 3) {
                    textCopy = allFormText[i].splice(0,3);
                    let j = 0;
                    for (let z = 0; z < allFormText[i].length; z++) {
                        j == 3 ? j = 1 : j++;
                        textCopy[j-1] = textCopy[j-1].concat('  ', allFormText[i][z]);
                    }
                    allFormText[i] = textCopy;
                }
            }
            for (let i = 0; i < 3; i++) {
                for (let z=0; z <allFormText[i].length; z++) {
                    if (this.modelContext.measureText(allFormText[i][z]).width > textSize[i]) {
                        textSize[i] = this.modelContext.measureText(allFormText[i][z]).width;
                    }
                }
            }
            this.place(...allFormText, ...textSize);
            this.resetAllIssueInput();
            this.hideform();
        }, {once: true})
    }
    updateContext() {
        this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
    resetAllIssueInput() {
        this.issueContent.value = "";
        this.data.value = "";
        this.result.value = "";
    }
    displayLine(x, y, issueWidth, issueHeight) {
        // Trait de guidage
        this.verticalLine.style.left = `${((x + (Math.round(issueWidth / 2)))) - Math.round(this.canvas.width / 2) - 10}px`;
        this.verticalLine.style.height = `${this.canvas.height + 20}px`;
        this.horizontalLine.style.top = `${(y - Math.round(this.canvas.height) - 32) + (Math.round(issueHeight / 2)) }px`;
        this.horizontalLine.style.width = `${this.canvas.width + 20}px`;
    }
    updateIssueClickArea(x, y) {
        this.clickArea[0] = [this.clickArea[0][0] + x, this.clickArea[0][1] + x];
        this.clickArea[1] = [this.clickArea[1][0] + y, this.clickArea[1][1] + y];
    }
    hideLine() {
        // Suppression trait de guidage
        this.verticalLine.style.left = 0;
        this.verticalLine.style.height = 0;
        this.horizontalLine.style.top = 0;
        this.horizontalLine.style.width = 0;
    }
    drawBrackets(newBracketHeigth, leftBracketPosX, rightBracketPosX) {
        let leftBracketParams = [...this.bracketsParam.leftPos, ...this.bracketsParam.size, leftBracketPosX, 16, 23, newBracketHeigth];
        let rightBracketParams = [...this.bracketsParam.rightPos, ...this.bracketsParam.size, rightBracketPosX, 16, 23, newBracketHeigth];
        // Accolade ouvrante
        this.modelContext.drawImage(this.brackets, ...leftBracketParams);
        // Accolade fermante
        this.modelContext.drawImage(this.brackets, ...rightBracketParams);
    }
    place(wordDataArray, wordResultArray, wordArray, maxDataBoxSizeX, maxResultBoxSizeX, maxBoxSizeX) {
        let newBracketHeigth = Math.round(16*(wordArray.length+1));

        this.modelContext.clearRect(0, 0, this.modelCanvas.width, this.modelCanvas.height);
        this.modelContext.fillStyle = "#ffffff";
        if (this.data.value !== "") {
            this.drawBrackets(newBracketHeigth, 0, Math.round(maxDataBoxSizeX + 23));
            // Data
            for (let i=0; i<wordDataArray.length; i++) {
                this.modelContext.fillText(`${wordDataArray[i]}`,23,(Math.round((16*wordArray.length+16)/2) + 28) - (wordDataArray.length * 8) + (i*16));
            }
        }
        // Sous problème
        this.modelContext.strokeStyle = "#ffffff";
        this.modelContext.strokeRect(Math.round(maxDataBoxSizeX + 49), 16, Math.round(maxBoxSizeX + 16), Math.round(16*wordArray.length+16));
        for (let i=0; i<wordArray.length; i++) {
            this.modelContext.fillText(`${wordArray[i]}`, Math.round(maxDataBoxSizeX + 57), 36+(i*16));
        }
        if (this.result.value !== "") {
            this.drawBrackets(newBracketHeigth, Math.round(maxDataBoxSizeX + maxBoxSizeX + 68), Math.round(maxDataBoxSizeX + maxBoxSizeX + maxResultBoxSizeX + 87))
            // Result
            for (let i=0; i<wordResultArray.length; i++) {
                this.modelContext.fillText(`${wordResultArray[i]}`, Math.round(maxDataBoxSizeX + maxBoxSizeX + 87), (Math.round((16*wordArray.length+16)/2) + 28) - (wordResultArray.length * 8) + (i*16));
            }
        }

        // Creation issueParams
        this.issueSize = [Math.round(maxDataBoxSizeX + maxBoxSizeX + maxResultBoxSizeX + 140), Math.round(16*wordArray.length+32) + 32];
        this.clickArea = [[Math.round(maxDataBoxSizeX + 49), Math.round(maxDataBoxSizeX + maxBoxSizeX + 65)],[16, Math.round(16*wordArray.length+16) +16]];
        // Récupération model issue
        this.imageData = this.modelContext.getImageData(0, 0, this.issueSize[0], this.issueSize[1]);
        

        // Vers image
        let modelImg = new Image();
        
        modelImg.src = this.modelCanvas.toDataURL('image/png');

        this.updateContext();

        let mouseDown = true;

        modelImg.addEventListener('load', () => {
            this.context.drawImage(modelImg, 0, 0, this.modelCanvas.width, this.modelCanvas.height, 0, 0, this.modelCanvas.width, this.modelCanvas.height);
            this.canvas.addEventListener('mousedown', (e) => {
                if ((e.offsetX >= this.clickArea[0][0] && e.offsetX <= this.clickArea[0][1]) && (e.offsetY >= this.clickArea[1][0] && e.offsetY <= this.clickArea[1][1])) {
                    this.canvas.addEventListener('mousemove', (a) =>{
                        if (mouseDown) {
                            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                            this.context.putImageData(this.imageData, 0, 0);
                            this.context.drawImage(modelImg, 0, 0, this.modelCanvas.width, this.modelCanvas.height, a.offsetX, a.offsetY, this.modelCanvas.width, this.modelCanvas.height);

                            this.displayLine(a.offsetX, a.offsetY, this.issueSize[0], this.issueSize[1]);
                        }
                    })
                }
            }) 
        }, {once: true})

        this.canvas.addEventListener('mouseup', (z) => {
            mouseDown = false;
            this.updateIssueClickArea(z.offsetX, z.offsetY);
            this.allIssueData.push([this.clickArea[0], this.clickArea[1], this.modelCanvas.toDataURL('image/png')]);
            this.hideLine();
            console.log(this.allIssueData);
        }, {once: true}); 

        
        /******************** A MODIFIER ********************************************/
        let mouseDown1 = true;
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.allIssueData?.[0]) {
                let img = new Image();
                img.src = this.allIssueData[0][2];
                img.addEventListener('load', () => {
                
                    if ((e.offsetX >= this.allIssueData[0][0][0] && e.offsetX <= this.allIssueData[0][0][1]) && (e.offsetY >= this.allIssueData[0][1][0] && e.offsetY <= this.allIssueData[0][1][1])) {
                        this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
                        mouseDown1 = true;
                        this.canvas.addEventListener('mousemove', (a) =>{
                            if (mouseDown1) {
                                console.log('ok');
                                
                                this.context.clearRect(0, 0, this.modelCanvas.width, this.modelCanvas.height);
                                // this.context.putImageData(this.imageData, 0, 0);
                                this.context.drawImage(img, 0, 0, this.modelCanvas.width, this.modelCanvas.height, a.offsetX, a.offsetY, this.modelCanvas.width, this.modelCanvas.height);

                                this.displayLine(a.offsetX, a.offsetY, this.allIssueData[0][0][1] - this.allIssueData[0][0][0], this.allIssueData[0][1][1] - this.allIssueData[0][1][0]);
                            }
                        })
                        this.canvas.addEventListener('mouseup', (z) => {
                            mouseDown1 = false;
                            // this.updateIssueClickArea(z.offsetX, z.offsetY);
                            // Mettre a jour les coordonnées
                            this.allIssueData[0][0][0] = z.offsetX;
                            this.allIssueData[0][0][1] = z.offsetX + 60;
                            this.allIssueData[0][1][0] = z.offsetY;
                            this.allIssueData[0][1][1] = z.offsetY + 80;
                            this.hideLine();
                            console.log(this.allIssueData);
                        }, {once: true});
                    }
                })
            }
        })  
    }
    create() {
        this.form.style.zIndex = 3;
        this.getFormText();
    }
}
