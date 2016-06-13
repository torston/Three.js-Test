/// <reference path="../typings/globals/three/index.d.ts" />
/// <reference path="../typings/globals/three-orbitcontrols/index.d.ts" />
/// <reference path="../typings/globals/dat-gui/index.d.ts" />
class Renderer {
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    camera: THREE.Camera;
    scene: THREE.Scene;
    renderer: THREE.Renderer;
    constructor(){}
    call() {
        this.mouse = new THREE.Vector2();
        console.log(this.mouse);
        this.raycaster = new THREE.Raycaster();
        console.log(this.raycaster);



        var scene = new THREE.Scene();
        var aspect = window.innerWidth / window.innerHeight;
        var camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 3000);

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.id = "canvas";
        document.body.appendChild(renderer.domElement);

        document.getElementById("canvas").addEventListener('click', (event) => this.mouseClick(event), true);
        
        camera.position.x = 30;
        camera.position.y = 30;
        camera.position.z = 30;

        camera.lookAt(scene.position);

        var planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        scene.add(plane);
        var axisHelper = new THREE.AxisHelper(10);
        scene.add(axisHelper);


        var sphereGeometry = new THREE.SphereGeometry(30, 100 , 100);
        var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xCBD932 });
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        var spotLight = new THREE.PointLight(0xffffff,2);
        spotLight.position.set(0, 0, 0);
        sphere.add(spotLight)

        sphere.position.set(0, 25, 13);
        scene.add(sphere);


        var t = 0;


        var render = function () {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            t += 0.2;
            sphere.position.x = 0 + 530 * Math.cos(t * Math.PI / 180);
            sphere.position.y = Math.abs(0 + 530 * Math.sin(t * Math.PI / 180));

        };


        render();

        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
    }

    meshes: Array<THREE.Object3D> = new Array<THREE.Object3D>();

    mouseClick(event: MouseEvent) {
        event.preventDefault();

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);


        var intersects = this.raycaster.intersectObjects(this.scene.children);

        //for (var i = 0; i < intersects.length; i++) {
        if (intersects.length == 0) {
            return;
        }

        let p = intersects[0].point;

        for (var i = 0; i < intersects.length; i++) {
            var element: THREE.Object3D = intersects[i].object;

            for (var j = 0; j < this.meshes.length; j++) {
                var existingPoint = this.meshes[j];
                console.log(element);
                console.log(existingPoint);
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
        //console.log(sphere.id);
        this.meshes.push(sphere)
        this.scene.add(sphere);
    }


    connect() {
        console.log("Connect!");
        var material = new THREE.LineBasicMaterial({
            color: 0xF7BD72
        });

        this.build(20);

        this.meshes = [];

    }

    build(height: number) {
        var rectLength = 20, rectWidth = 20;
        let g: Array<THREE.Vector3> = new Array<THREE.Vector3>();
        var v: number[] = [];
        let index = 0;

        this.meshes.forEach(element => {
            g.push(element.position);
            let pos = element.position;
            pos.y = 20;
            g.push(pos);
            v.push(i);
            v.push(i + 1);
            v.push(i + 2);
            index += 2;
        });
        console.log(g.length + " " + v.length)
        var vertices = g;
        var holes = [];
        var mesh;
        var geometry = new THREE.Geometry();
        var material = new THREE.MeshBasicMaterial();

        geometry.vertices = g;

        var triangles = THREE.ShapeUtils.triangulateShape(v, holes);
        console.log(triangles.length + " " + v.length)
        for (var i = 0; i < triangles.length; i++) {
            geometry.faces.push(new THREE.Face3(triangles[i][0], triangles[i][1], triangles[i][2]));
        }

        mesh = new THREE.Mesh(geometry, material);

        this.scene.add(mesh);

    }
}