class Renderer {
    public scene: THREE.Scene;
    public renderer: THREE.Renderer;
    public camera: THREE.Camera;

    public sunRotate: boolean = true;
    private clickEnable: boolean = true;

    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;

    private sphere: THREE.Object3D;
    private time = new THREE.Clock(true);

    public init() {
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.scene = new THREE.Scene();
        this.camera = this.createCamera();
        this.camera.lookAt(this.scene.position);
        this.renderer = this.createRenderer();

        document.getElementById("canvas").addEventListener('click', (event) => this.mouseClick(event), true);

        var axisHelper = new THREE.AxisHelper(10);
        var ground = this.createGround();
        this.sphere = this.createSun();

        this.scene.add(this.sphere);
        this.sphere.position.set(0, 500, 13);
        this.scene.add(axisHelper);
        this.scene.add(ground);

        this.render();
    }

    public setSunPosition(x: number, y: number, z: number) {
        this.sphere.position.set(x, y, z);
    }

    render() {
        this.animate(this.time.getDelta());

        if (this.sunRotate) {
            this.sphere.position.x = 0 + 530 * Math.cos(this.time.getElapsedTime() * Math.PI / 180);
            this.sphere.position.y = Math.abs(0 + 530 * Math.sin(this.time.getElapsedTime() * Math.PI / 180));
        }


        requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene, this.camera);

    }

    animate(time: number) {
       TWEEN.update();
    }

    createCamera(): THREE.PerspectiveCamera {
        var aspect = window.innerWidth / window.innerHeight;
        let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 3000);
        camera.position.x = 30;
        camera.position.y = 30;
        camera.position.z = 30;
        camera.lookAt(this.scene.position);
        return camera;
    }
    createRenderer(): THREE.WebGLRenderer {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.id = "canvas";
        document.body.appendChild(renderer.domElement);
        return renderer;
    }

    createGround(): THREE.Object3D {
        var planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        return plane;
    }

    createSun(): THREE.Object3D {
        var sphereGeometry = new THREE.SphereGeometry(30, 100, 100);
        var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xCBD932 });
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        var spotLight = new THREE.PointLight(0xffffff, 1);
        spotLight.position.set(0, 500, 0);
        sphere.add(spotLight)

        return sphere;

    }

    setEditingMode(value: boolean) 
    {
        if (!value) 
        {
            for (var i = 0; i < this.meshes.length; i++) {
                var element = this.meshes[i];
                this.scene.remove(element);
                element = null;
            }

            this.meshes = [];
            
        } 
        this.clickEnable = value;
    }

    meshes: Array<THREE.Object3D> = new Array<THREE.Object3D>();

    mouseClick(event: MouseEvent) {

        if (!this.clickEnable) {
            return;
        }

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);


        var intersects = this.raycaster.intersectObjects(this.scene.children);

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

        this.meshes.push(sphere);
        var position = sphere.position;

        var p2=new THREE.Vector3(0,100,0);


        var target = p2.add(sphere.position);

        var t = new TWEEN.Tween(position)
						.to(target, 2000)
						.delay(100)
						.onUpdate(function() {
							sphere.position.x = position.x;
                            sphere.position.y = position.y;
						});

                         t.start();
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