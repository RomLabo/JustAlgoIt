export class Issue {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.form = document.getElementById('issue-form');
        this.data = document.getElementById('data');
        this.issueContent = document.getElementById('issue');
        this.result = document.getElementById('result');
        this.validIssue = document.getElementById('valid-issue');
    }
    displayform() {
        this.form.style.zIndex = this.form.style.zIndex == 2 ? -5 : 2;
    }
    writeText() {
        this.validIssue.addEventListener('click', () => {
            this.context.font = '16px serif';
            let maxBoxSizeX = 0;
            let wordArray = this.issueContent.value.split('\n');
            for (let i=0; i<wordArray.length; i++) {
                if (this.context.measureText(wordArray[i]).width > maxBoxSizeX) {
                    maxBoxSizeX = this.context.measureText(wordArray[i]).width;
                }
            }
            this.displayform();
            this.placeIssue(wordArray, maxBoxSizeX);
        })
    }
    placeIssue(wordArray, maxBoxSizeX) {
        let mouseDown = false;
        this.canvas.addEventListener('mousemove', (a) => {
            if (!mouseDown) {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.strokeRect(a.offsetX - 6, a.offsetY - 14, maxBoxSizeX + 12, 12*wordArray.length+8);
                for (let i=0; i<wordArray.length; i++) {
                    this.context.fillText(`${wordArray[i]}`, a.offsetX, a.offsetY+(i*12));
                }
            }
            this.canvas.addEventListener('click', () => mouseDown = true);
        })
    }
    createIssue() {
        this.displayform();
        this.writeText();
    }
}