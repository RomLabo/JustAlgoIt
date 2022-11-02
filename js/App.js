import { File } from './main/File.js';

import { Eraser } from './tools/Eraser.js';
import { Issue } from './tools/Issue.js';
import { Color } from './tools/Color.js';

class App {
    constructor() {
        this.canvas = document.getElementById('main-canvas');
        this.allBtn = document.querySelectorAll('button');
        this.canvas.width = window.innerWidth * .98;
        this.canvas.height = window.innerHeight * .9;
        this.context = this.canvas.getContext('2d');
        
        this.file = new File();

        this.eraser = new Eraser();
        this.issue = new Issue();
        this.color = new Color();
    }
    main() {
        this.file.createFile();
        this.context.fillStyle = "#161b22";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.allBtn.forEach(btn => btn.addEventListener('click', (e) => {
            switch (btn.id) {
                case 'new-file': 
                    this.file.createFile();
                    break;
                case 'open-file':
                    this.file.openAndLoadFile();
                    break;
                case 'save-file':
                    this.color.invert();
                    // then save image
                    break;
                case 'undo':
                    console.log('undo');
                    break;
                case 'redo':
                    console.log('redo');
                    break;
                case 'eraser':
                    this.eraser.erase();
                    console.log('eraser');
                    break;
                case 'prob':
                    this.issue.createIssue();
                    break;
            }
        }))
    }
}

const app = new App();
app.main();









