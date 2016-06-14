class Renderer {
    public scene: THREE.Scene;
    public renderer: THREE.Renderer;
    public camera: THREE.Camera;
    public ground: THREE.Object3D;
    public sunRotate: boolean = true;

    private sphere: THREE.Object3D;
    private time = new THREE.Clock(true);

    public init() {

        this.scene = new THREE.Scene();
        this.camera = this.createCamera();
        this.camera.lookAt(this.scene.position);
        this.renderer = this.createRenderer();

        var axisHelper = new THREE.AxisHelper(10);
        this.ground = this.createGround();
        this.sphere = this.createSun();

        this.scene.add(this.sphere);
        this.sphere.position.set(0, 500, 13);
        this.scene.add(axisHelper);
        this.scene.add(this.ground);

        this.render();
    }

    public setSunPosition(x: number, y: number, z: number) {
        this.sphere.position.set(x, y, z);
    }

    render() {
        this.animate(this.time.getDelta());

        if (this.sunRotate) {
            this.sphere.position.x = 0 + 530 * Math.cos(this.time.getElapsedTime() * 10 * Math.PI / 180);
            this.sphere.position.y = Math.abs(0 + 530 * Math.sin(this.time.getElapsedTime()* 10 * Math.PI / 180));
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
    
}