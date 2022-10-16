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
            let textSize = this.context.measureText(this.issueContent.value).width;
            this.context.fillText(`${this.issueContent.value}`, 50, 100);
            this.context.strokeRect(44, 86,textSize + 12, 24);
            this.displayform();
        })
    }
    createIssue() {
        this.displayform();
        this.writeText();
    }
}