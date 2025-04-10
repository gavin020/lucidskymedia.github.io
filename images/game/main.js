// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

// Cube target
let targetCube;
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
function spawnTarget() {
    targetCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    targetCube.position.set(0, 0, -10);
    scene.add(targetCube);
}

// Projectile
let projectile;
const projectileGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const projectileMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
function shoot() {
    projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);
    projectile.position.set(0, 0, 0); // Start at camera
    scene.add(projectile);
}

// Explosion effect
function explodeCube() {
    scene.remove(targetCube);
    const fragments = [];
    for (let i = 0; i < 10; i++) {
        const fragment = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 0.2),
            cubeMaterial
        );
        fragment.position.copy(targetCube.position);
        fragment.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5
        );
        scene.add(fragment);
        fragments.push(fragment);
    }
    // Remove fragments after a delay
    setTimeout(() => {
        fragments.forEach(f => scene.remove(f));
    }, 1000);
}

// Game state
let cubeSpeed = 0.05;
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Move target cube
    if (targetCube) {
        targetCube.position.z -= cubeSpeed;
        targetCube.rotation.x += 0.01;
        targetCube.rotation.y += 0.01;
        if (targetCube.position.z < -50) {
            scene.remove(targetCube);
            spawnTarget();
        }
    }

    // Move projectile
    if (projectile) {
        projectile.position.z -= 0.2;
        if (projectile.position.z < -50) {
            scene.remove(projectile);
            projectile = null;
        }
        // Collision detection
        if (targetCube && projectile) {
            const distance = projectile.position.distanceTo(targetCube.position);
            if (distance < 1) {
                explodeCube();
                scene.remove(projectile);
                projectile = null;
                setTimeout(spawnTarget, 1000); // Respawn after explosion
            }
        }
    }

    renderer.render(scene, camera);
}

// Event listener for shooting
document.addEventListener('click', () => {
    if (!projectile) shoot();
});

// Start game
spawnTarget();
animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
