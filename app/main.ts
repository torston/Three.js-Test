/// <reference path="../typings/index.d.ts" />
window.onload = () => {
    var t = new Renderer();
    t.init();

    var controller = new BuildingsController(t);

    var controls = new Controls(t,controller);
    
    controls.initSceneMoveControls();
    controls.initGlobalControls();


}

