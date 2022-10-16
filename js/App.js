import { File } from './main/File.js';

import { Eraser } from './tools/Eraser.js';

class App {
    constructor() {
        this.canvas = document.getElementById('main-canvas');
        this.allBtn = document.querySelectorAll('button');
        this.canvas.width = window.innerWidth * .98;
        this.canvas.height = window.innerHeight * .86;
        
        this.file = new File();

        this.eraser = new Eraser();
    }
    main() {
        this.file.createFile();
        this.allBtn.forEach(btn => btn.addEventListener('click', (e) => {
            switch (btn.id) {
                case 'new-file': 
                    this.file.createFile();
                    break;
                case 'open-file':
                    this.file.openAndLoadFile();
                    break;
                case 'save-file':
                    console.log('save');
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
            }
        }))
    }
}

const app = new App();
app.main();









