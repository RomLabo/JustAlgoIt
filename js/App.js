const landmarks = new Landmark(
    "main-canvas", 
    "landmark__vertical", 
    "landmark__horizontal"
);

const app = new Controller(new Model(), new View());

landmarks.init();