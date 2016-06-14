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
            let removeIndexesCount:number = 0;
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
            this.meshes = this.meshes.slice(removeIndexesCount,this.meshes.length);

            if (this.meshes.length <= 2) {
                this.cleanMeshes();
                throw new Error("path shoud contains more than 2 points!")
            }
            this.connect()
        }
        else {
            intersects = this.raycaster.intersectObjects(this.r.scene.children);

            if (intersects.length == 0 || intersects == []) {
                return;
            }

            let intersectionPoint = intersects[0].point;
            let sphere = this.helper.getPointMarker();

            sphere.position.set(intersectionPoint.x, 0, intersectionPoint.z);

            if (this.meshes.length > 0) {

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

            this.meshes.push(sphere);
            this.r.scene.add(sphere);
        }
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
                if (H.segment_intersection(
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
        var material = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        var wallsGeometry = new THREE.Geometry();

        for (var i = 0; i < this.meshes.length; i++) {
            let pos1 = this.meshes[i].position;
            let pos2 = i + 1 == this.meshes.length ? this.meshes[0].position : this.meshes[i + 1].position;

            wallsGeometry.vertices.push(pos1);
            wallsGeometry.vertices.push(pos2);
            wallsGeometry.vertices.push((new THREE.Vector3(0, height, 0)).add(pos1));
            wallsGeometry.vertices.push((new THREE.Vector3(0, height, 0)).add(pos2));
        }

        for (var i = 0; i < wallsGeometry.vertices.length; i += 4) {
            wallsGeometry.faces.push(new THREE.Face3(i + 2, i + 1, i));
            wallsGeometry.faces.push(new THREE.Face3(i + 2, i + 3, i + 1));

        }

        var mesh = new THREE.Mesh(wallsGeometry, material);

        var roofGeometry = new THREE.Geometry();

        for (var i = 0; i < this.meshes.length; i++) {
            roofGeometry.vertices[roofGeometry.vertices.length - 3 - i] = (new THREE.Vector3(0, height, 0)).add(this.meshes[i].position)
        }

        var totalX: number = 0;
        var totalY: number = 0;

        for (var i = 0; i < this.meshes.length; i++) {
            roofGeometry.vertices.push((new THREE.Vector3(0, height, 0)).add(this.meshes[i].position));
            totalX += (this.meshes[i].position.x);
            totalY += (this.meshes[i].position.z);
        }

        var midPoint = new THREE.Vector3(totalX / this.meshes.length, height, totalY / this.meshes.length);

        roofGeometry.vertices.push(midPoint);

        var lastVertIndex = roofGeometry.vertices.length - 1;

        var mark: boolean = false;
        for (var i = 0; i < roofGeometry.vertices.length; i++) {
            mark = !mark;

            let next = i + 1 == this.meshes.length ? 0 : i + 1;

            if (mark) {
                roofGeometry.faces.push(new THREE.Face3(lastVertIndex, next, i));
            } else {
                roofGeometry.faces.push(new THREE.Face3(i, lastVertIndex, next));
            }
        }

        roofGeometry.mergeMesh(mesh);
        roofGeometry.computeFaceNormals();

        var cylinder = new THREE.Mesh(roofGeometry, material);

        cylinder.position.setY(-height - 1);

        this.r.scene.add(cylinder)
        this.moveUp(cylinder, height);
    }

    moveUp(cylinder: THREE.Object3D, height: number) {
        var position = cylinder.position;

        var p2 = new THREE.Vector3(0, height, 0);


        var target = p2.add(cylinder.position);

        var t = new TWEEN.Tween(position)
        				.to(target, 2000)
        				.delay(100)
        				.onUpdate(function () {
                cylinder.position.x = position.x;
                cylinder.position.y = position.y;
        				});

        t.start();

    }
}

/**
 * H
 */
class H {
    private static eps = 0.0000001;
    private static between(a: number, b: number, c: number): boolean {
        return a - H.eps <= b && b <= c + H.eps;
    }
    public static segment_intersection(lineOneStart: THREE.Vector2, lineOneEnd: THREE.Vector2, lineTwoStart: THREE.Vector2, lineTwoEnd: THREE.Vector2): boolean {
        var x = ((lineOneStart.x * lineOneEnd.y - lineOneStart.y * lineOneEnd.x) * (lineTwoStart.x - lineTwoEnd.x) - (lineOneStart.x - lineOneEnd.x) * (lineTwoStart.x * lineTwoEnd.y - lineTwoStart.y * lineTwoEnd.x)) /
            ((lineOneStart.x - lineOneEnd.x) * (lineTwoStart.y - lineTwoEnd.y) - (lineOneStart.y - lineOneEnd.y) * (lineTwoStart.x - lineTwoEnd.x));
        var y = ((lineOneStart.x * lineOneEnd.y - lineOneStart.y * lineOneEnd.x) * (lineTwoStart.y - lineTwoEnd.y) - (lineOneStart.y - lineOneEnd.y) * (lineTwoStart.x * lineTwoEnd.y - lineTwoStart.y * lineTwoEnd.x)) /
            ((lineOneStart.x - lineOneEnd.x) * (lineTwoStart.y - lineTwoEnd.y) - (lineOneStart.y - lineOneEnd.y) * (lineTwoStart.x - lineTwoEnd.x));
        if (isNaN(x) || isNaN(y)) {
            return false;
        } else {
            if (lineOneStart.x >= lineOneEnd.x) {
                if (!this.between(lineOneEnd.x, x, lineOneStart.x)) { return false; }
            } else {
                if (!this.between(lineOneStart.x, x, lineOneEnd.x)) { return false; }
            }
            if (lineOneStart.y >= lineOneEnd.y) {
                if (!this.between(lineOneEnd.y, y, lineOneStart.y)) { return false; }
            } else {
                if (!this.between(lineOneStart.y, y, lineOneEnd.y)) { return false; }
            }
            if (lineTwoStart.x >= lineTwoEnd.x) {
                if (!this.between(lineTwoEnd.x, x, lineTwoStart.x)) { return false; }
            } else {
                if (!this.between(lineTwoStart.x, x, lineTwoEnd.x)) { return false; }
            }
            if (lineTwoStart.y >= lineTwoEnd.y) {
                if (!this.between(lineTwoEnd.y, y, lineTwoStart.y)) { return false; }
            } else {
                if (!this.between(lineTwoStart.y, y, lineTwoEnd.y)) { return false; }
            }
        }
        return true;
    }
}