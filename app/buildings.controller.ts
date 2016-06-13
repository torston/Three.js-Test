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

        if (intersects.length == 0) {
            return;
        }

        console.log(intersects.length);

        let p = intersects[0].point;

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
        sphere.position.set(p.x, p.y, p.z);

        this.meshes.push(sphere);
        // var position = sphere.position;

        // var p2=new THREE.Vector3(0,100,0);


        // var target = p2.add(sphere.position);

        // var t = new TWEEN.Tween(position)
        // 				.to(target, 2000)
        // 				.delay(100)
        // 				.onUpdate(function() {
        // 					sphere.position.x = position.x;
        //                     sphere.position.y = position.y;
        // 				});

        //                  t.start();
        this.r.scene.add(sphere);
    }


    connect() {
        console.log("Connect!");
        var material = new THREE.LineBasicMaterial({
            color: 0xF7BD72
        });

        this.build(100);

        this.meshes = [];

    }

    build(height: number) {
        var rectLength = 20, rectWidth = 20;
        let g: Array<THREE.Vector3> = new Array<THREE.Vector3>();
        var v: number[] = [];
        let index = 0;

        var geometry = new THREE.Geometry();



        // this.meshes.forEach(element => {
        //     g.push(element.position);

        for (var i = 0; i < this.meshes.length; i++) {
            let pos1 = this.meshes[i].position;
            let pos2 = i + 1 == this.meshes.length ? this.meshes[0].position : this.meshes[i + 1].position;

            g.push(pos1);
            g.push(pos2);
            g.push((new THREE.Vector3(0, height, 0)).add(pos1));
            g.push((new THREE.Vector3(0, height, 0)).add(pos2));
        }

        g.forEach(element => {
            geometry.vertices.push(element);
        });

        for (var i = 0; i < g.length; i += 4) {
            geometry.faces.push(new THREE.Face3(i + 2, i + 1, i));
            geometry.faces.push(new THREE.Face3(i + 2, i + 3, i + 1));

        }

        var material = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        geometry.computeFaceNormals();

        var mesh = new THREE.Mesh(geometry, material);

        var geometry2 =  new THREE.CircleGeometry( 100, this.meshes.length);

        console.log(geometry2);

        for (var i = 0; i < this.meshes.length; i++) {
            geometry2.vertices[geometry2.vertices.length - 3 - i] = (new THREE.Vector3(0, height, 0)).add(this.meshes[i].position)
        }

        var totalX: number = 0;
        var totalY: number = 0;

        for (var i = 0; i < this.meshes.length; i++) {
            totalX += (this.meshes[i].position.x);
            totalY += (this.meshes[i].position.z);
        }

        var c2 = new THREE.Vector3(totalX/ this.meshes.length, height,totalY/this.meshes.length);

        var material2 = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        geometry2.vertices[geometry2.vertices.length - 1] = c2;
        geometry2.vertices[geometry2.vertices.length - 2] = (new THREE.Vector3(0, height, 0)).add(this.meshes[0].position);
        geometry2.computeFaceNormals();

        var cylinder = new THREE.Mesh(geometry2, material2);

        this.r.scene.add(cylinder)


        console.log(mesh);

        this.r.scene.add(mesh);

    }
}