/**
 * BuildingsController
 */
class BuildingsController {

    private clickEnable: boolean = true;
    private raycaster: THREE.Raycaster;
    private helper: BuildingsHelper;

    private meshes: Array<THREE.Object3D>;
    private lines: Array<THREE.Object3D>;

    constructor(private r: Renderer) {
        this.raycaster = new THREE.Raycaster();
        this.meshes = new Array<THREE.Object3D>();
        this.lines = new Array<THREE.Object3D>();
        this.helper = new BuildingsHelper();

        document.getElementById("canvas").addEventListener('contextmenu', (event) => this.mouseClick(event), true);
    }

    private mouseClick(event: MouseEvent) {
        if (!this.clickEnable) {
            return;
        }

        let mouse: THREE.Vector2 = new THREE.Vector2();;

        mouse.x = ((event.clientX - this.r.renderer.domElement.offsetLeft) / this.r.renderer.domElement.width) * 2 - 1;
        mouse.y = - ((event.clientY - this.r.renderer.domElement.offsetTop) / this.r.renderer.domElement.height) * 2 + 1;

        var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);

        this.raycaster.setFromCamera(mouse, this.r.camera);
        var intersects = this.raycaster.intersectObjects(this.meshes);

        if (intersects.length > 0) {
            let removeIndexesCount: number = 0;
            for (var i = 0; i < this.meshes.length - 1; i++) {
                var element = this.meshes[i];
                if (element != intersects[0].object) {
                    removeIndexesCount++;
                    this.r.scene.remove(element);
                    console.warn("find dot not in path! removed")
                } else {
                    break;
                }
            }
            this.meshes = this.meshes.slice(removeIndexesCount, this.meshes.length);

            if (this.meshes.length <= 2) {
                this.cleanMeshes();
                throw new Error("path shoud contains more than 2 points!")
            }
            this.connect()
        }
        else {
            intersects = this.raycaster.intersectObject(this.r.ground);

            if (intersects.length == 0 || intersects == []) {
                return;
            }

            let intersectionPoint = intersects[0].point;
            let sphere = this.helper.getPointMarker();

            sphere.position.set(intersectionPoint.x, 0, intersectionPoint.z);

            if (this.meshes.length > 0) {
                this.createLine(intersectionPoint);
            }

            this.meshes.push(sphere);
            this.r.scene.add(sphere);
        }
    }

    createLine(intersectionPoint: THREE.Vector3): void {
        var geometry = new THREE.Geometry();

        var lStart = this.meshes[this.meshes.length - 1].position.clone().add(new THREE.Vector3(0, 1, 0));
        var lFinish = intersectionPoint.clone().add(new THREE.Vector3(0, 1, 0));

        if (this.isWrongLine(lStart, lFinish)) {
            throw new Error("lines intersects!");
        }

        geometry.vertices.push(lStart);
        geometry.vertices.push(lFinish);

        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({}));
        this.lines.push(line);
        this.r.scene.add(line);
    }

    isWrongLine(l1s: THREE.Vector3, l1f: THREE.Vector3): boolean {
        for (var i = 0; i < this.meshes.length - 1; i++) {

            let lStartTmp = this.meshes[i].position.clone().add(new THREE.Vector3(0, 1, 0));
            let lFinishTmp = this.meshes[i + 1].position.clone().add(new THREE.Vector3(0, 1, 0));

            if (i == this.meshes.length - 2) {
                if (l1s == lStartTmp && l1f == lFinishTmp) {
                    return true;
                }
            } else {
                if (IntersectLineHelper.segment_intersection(
                    new THREE.Vector2(l1s.x, l1s.z),
                    new THREE.Vector2(l1f.x, l1f.z),
                    new THREE.Vector2(lStartTmp.x, lStartTmp.z),
                    new THREE.Vector2(lFinishTmp.x, lFinishTmp.z))
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    connect() {
        console.log("Connect!");

        var heightString = prompt("Please enter heights", "50");

        var n = parseFloat(heightString);

        if (!isNaN(n)) {
            this.build(n);
            this.cleanMeshes();
        } else {
            this.cleanMeshes();
            throw new Error("Not valid height!");
        }

    }

    cleanMeshes() {
        this.meshes.forEach(element => {
            this.r.scene.remove(element);
        });
        this.lines.forEach(element => {
            this.r.scene.remove(element);
        });

        this.meshes = [];
    }

    build(height: number) {

        var extractedPoints =  this.meshes.map<THREE.Vector3>((m) => {return m.position;});

        var building = this.helper.build(
            height,
            extractedPoints
        );

        this.r.scene.add(building)
        this.moveUp(building, height);
    }

    moveUp(building: THREE.Object3D, height: number) {
        var position = building.position;

        var p2 = new THREE.Vector3(0, height, 0);


        var target = p2.add(building.position);

        var t = new TWEEN.Tween(position)
        				.to(target, 2000)
        				.delay(100)
        				.onUpdate(function () {
                building.position.x = position.x;
                building.position.y = position.y;
        				});

        t.start();

    }
}