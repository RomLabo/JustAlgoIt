import { File } from './main/File.js';
import { Data } from './main/Data.js';
import { Color } from './main/Color.js';
import { Eraser } from './main/Eraser.js';
import { Landmark } from './main/Landmark.js';

import { Issue } from './models/Issue.js';


class App {
    constructor() {
        this.canvas = document.getElementById('main-canvas');
        this.allBtn = document.querySelectorAll('.main-btn');
        this.downloadBtn = document.getElementById('save-file');
        this.canvas.width = window.innerWidth * .98;
        this.canvas.height = window.innerHeight * .9;
        this.context = this.canvas.getContext('2d');
        
        this.file = new File();
        this.data = new Data();
        this.eraser = new Eraser();
        this.color = new Color();
        this.landmarks = new Landmark();
        
        this.issue = new Issue();
    }
    main() {
        this.file.create();

        this.allBtn.forEach(btn => btn.addEventListener('click', (e) => {
            switch (btn.id) {
                case 'new-file': 
                    this.file.create();
                    break;
                case 'open-file':
                    this.file.openAndLoad();
                    break;
                case 'save-file':
                    this.color.lighten();
                    this.downloadBtn.href = this.canvas.toDataURL();
                    break;
                case 'undo':
                    this.data.undo();
                    break;
                case 'redo':
                    this.data.redo();
                    break;
                case 'eraser':
                    this.eraser.erase();
                    break;
                case 'add':
                    this.issue.create();
                    //this.landmarks.display();
                    this.data.add();
                    break;
            }
        }))
    }
}

const app = new App();
app.main();









