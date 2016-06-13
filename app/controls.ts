/**
 * Controls
 */

class Controls {

    sceneSettings: SceneSettings;

    constructor(private r: Renderer, private c: BuildingsController) {
    }

    initSceneMoveControls() {
        var controls = new THREE.OrbitControls(this.r.camera, this.r.renderer.domElement);

        controls.enablePan = false;
        controls.center = new THREE.Vector3(0, 0, 0);

        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI / 2 - (Math.PI / 360) * 10;

        controls.update();
    }

    initGlobalControls(){

        this.sceneSettings = new SceneSettings();

        let s = this.sceneSettings;

        var gui = new dat.GUI();

        var sunRotateController = gui.add(s, 'sunRotation');
        var editModeController = gui.add(s, 'editingMode');

        sunRotateController.onFinishChange((value: boolean) => {
            this.setSunRotate(value);
        });

        editModeController.onFinishChange((value: boolean) => {
            this.setEditModeEnabled(value);
        });

        var folder = gui.addFolder("Sun Position")
        folder.add(s, 'sunPositionX');
        folder.add(s, 'sunPositionY');
        folder.add(s, 'sunPositionZ');

        var setPositionButton = { set: () => { this.setPosition(); } };
        folder.add(setPositionButton, 'set');
    }

    private setEditModeEnabled(value: boolean) {
        console.log("setEditModeEnabled: " + value);
        this.c.setEditingMode(value);
    }

    private setSunRotate(value: boolean) {
        console.log("sun rot: " + value);
        this.r.sunRotate = value;
    }

    private setPosition() {
        let s = this.sceneSettings;

        this.r.setSunPosition(s.sunPositionX,s.sunPositionY,s.sunPositionZ);
        console.log(s.sunPositionX + " " + s.sunPositionY + " " + s.sunPositionZ);
    }


}
/**
 * SceneSettings
 */
class SceneSettings {
    editingMode: boolean = true;
    sunRotation: boolean = true;
    sunPositionX: number = 0;
    sunPositionY: number = 0;
    sunPositionZ: number = 0;
}