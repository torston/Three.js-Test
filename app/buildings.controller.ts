/**
 * BuildingsController
 */
class BuildingsController {

    private clickEnable: boolean = true;
    private raycaster: THREE.Raycaster;
    private helper: BuildingsHelper;
    private meshes: Array<THREE.Object3D>;

    constructor(private r: Renderer) {
        this.raycaster = new THREE.Raycaster();
        this.meshes = new Array<THREE.Object3D>()
        this.helper = new BuildingsHelper();

        document.getElementById("canvas").addEventListener('contextmenu', (event) => this.mouseClick(event), true);
    }

    setEditingMode(value: boolean) {
        if (!value) {
            for (var i = 0; i < this.meshes.length; i++) {
                var element = this.meshes[i];
                this.r.scene.remove(element);
                element = null;
            }

            this.meshes = [];

        }
        this.clickEnable = value;
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
            this.connect()
        }
        else {
            intersects = this.raycaster.intersectObjects(this.r.scene.children);

            if (intersects.length == 0 || intersects == []) {
                return;
            }

            let firstIntersection = intersects[0].point;
            let sphere = this.helper.getPointMarker();

            sphere.position.set(firstIntersection.x, 0, firstIntersection.z);

            this.meshes.push(sphere);
            this.r.scene.add(sphere);
        }
    }


    connect() {
        console.log("Connect!");

        var heightString = prompt("Please enter heights", "50");

        var n = parseFloat(heightString);

        if (!isNaN(n)) {
            this.build(100);
        }
        
        this.cleanMeshes();
    }

    cleanMeshes() {
        this.meshes.forEach(element => {
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