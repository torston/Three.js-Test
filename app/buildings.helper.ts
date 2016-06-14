class BuildingsHelper {

    getPointMarker(): THREE.Object3D {
        var sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
        var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xF7BD72 });
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        return sphere;
    }

    build(height: number,positions:THREE.Vector3[]) : THREE.Object3D
    {
        var material = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        var wallsGeometry = new THREE.Geometry();

        for (var i = 0; i < positions.length; i++) {
            let pos1 = positions[i];
            let pos2 = i + 1 == positions.length ? positions[0] : positions[i + 1];

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

        for (var i = 0; i < positions.length; i++) {
            roofGeometry.vertices[roofGeometry.vertices.length - 3 - i] = (new THREE.Vector3(0, height, 0)).add(positions[i])
        }

        var totalX: number = 0;
        var totalY: number = 0;

        for (var i = 0; i < positions.length; i++) {
            roofGeometry.vertices.push((new THREE.Vector3(0, height, 0)).add(positions[i]));
            totalX += (positions[i].x);
            totalY += (positions[i].z);
        }

        var midPoint = new THREE.Vector3(totalX / positions.length, height, totalY / positions.length);

        roofGeometry.vertices.push(midPoint);

        var lastVertIndex = roofGeometry.vertices.length - 1;

        var mark: boolean = false;
        for (var i = 0; i < roofGeometry.vertices.length; i++) {
            mark = !mark;

            let next = i + 1 == positions.length ? 0 : i + 1;

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

        return cylinder;

    }

}