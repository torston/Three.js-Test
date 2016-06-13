/// <reference path="../typings/globals/three/index.d.ts" />
/// <reference path="../typings/globals/three-orbitcontrols/index.d.ts" />
/// <reference path="../typings/globals/dat-gui/index.d.ts" />
/// <reference path="../typings/globals/tween.js/index.d.ts" />
window.onload = () => {
    var t = new Renderer();
    t.init();

    var controls = new Controls(t);
    controls.initSceneMoveControls();
    controls.initGlobalControls();
}

