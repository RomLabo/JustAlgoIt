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
    }
    writeText() {
        this.validIssue.addEventListener('click', () => {
            this.context.font = '16px arial';
            let maxBoxSizeX = 0;
            let wordArray = this.issueContent.value.split('\n');
            for (let i=0; i<wordArray.length; i++) {
                if (this.context.measureText(wordArray[i]).width > maxBoxSizeX) {
                    maxBoxSizeX = this.context.measureText(wordArray[i]).width;
                }
            }
            this.hideform();
            this.placeIssue(wordArray, maxBoxSizeX);
        })
    }
    hideform() {
        this.form.style.zIndex = -5;
    }
    placeIssue(wordArray, maxBoxSizeX) {
        let mouseDown = false;
        this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.addEventListener('mousemove', (a) => {
            if (!mouseDown) {
                this.context.fillStyle = "#161b22";
                this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.fillStyle = "#ffffff";
                this.context.putImageData(this.imageData, 0, 0);
                this.context.strokeStyle = "#ffffff";
                this.context.strokeRect(a.offsetX - 8, a.offsetY - 18, maxBoxSizeX + 12, 12*wordArray.length+14);
                for (let i=0; i<wordArray.length; i++) {
                    this.context.fillText(`${wordArray[i]}`, a.offsetX, a.offsetY+(i*12));
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