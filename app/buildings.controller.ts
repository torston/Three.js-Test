/**
 * BuildingsController
 */
class BuildingsController {

    private clickEnable: boolean = true;
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;

    private meshes: Array<THREE.Object3D> = new Array<THREE.Object3D>();

    constructor(private r: Renderer) {
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

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

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.r.camera);


        var intersects = this.raycaster.intersectObjects(this.r.scene.children);

        if (intersects.length == 0 || intersects == []) {
            return;
        }

        let firstIntersection = intersects[0].point;

        for (var i = 0; i < intersects.length; i++) {
            var element: THREE.Object3D = intersects[i].object;

            for (var j = 0; j < this.meshes.length; j++) {
                var existingPoint = this.meshes[j];
                if (existingPoint.uuid == element.uuid) {
                    this.connect()
                    return;
                }
            }

        }

        var sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
        var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xF7BD72 });
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        sphere.position.set(firstIntersection.x, 0, firstIntersection.z);

        this.meshes.push(sphere);
        this.r.scene.add(sphere);
    }


    connect() {
        console.log("Connect!");
        this.build(100);
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

        var roofGeometry = new THREE.CircleGeometry(100, this.meshes.length);
        //roofGeometry.vertices.splice(roofGeometry.vertices.length - 1);
        for (var i = 0; i < this.meshes.length; i++) {
            roofGeometry.vertices[roofGeometry.vertices.length - 3 - i] = (new THREE.Vector3(0, height, 0)).add(this.meshes[i].position)
        }

        var totalX: number = 0;
        var totalY: number = 0;

        for (var i = 0; i < this.meshes.length; i++) {
            totalX += (this.meshes[i].position.x);
            totalY += (this.meshes[i].position.z);
        }

        var midPoint = new THREE.Vector3(totalX / this.meshes.length, height, totalY / this.meshes.length);

        roofGeometry.vertices[roofGeometry.vertices.length - 1] = midPoint;
        //roofGeometry.vertices[roofGeometry.vertices.length - 2] = midPoint;

        roofGeometry.mergeMesh(mesh);
        roofGeometry.computeFaceNormals();
        roofGeometry.faceVertexUvs = [];

        var cylinder = new THREE.Mesh(roofGeometry, material);

        cylinder.position.setY(-height);

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