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

// Loaders
const objLoader = new THREE.OBJLoader();
const mtlLoader = new THREE.MTLLoader();

// Target model
let targetModel;
let targetTemplate; // Store the loaded OBJ for reuse
function spawnTarget() {
    if (targetTemplate) {
        targetModel = targetTemplate.clone();
        targetModel.position.set(0, 0, -10);
        scene.add(targetModel);
    }
}

// Projectile model
let projectile;
let projectileTemplate;
function shoot() {
    if (projectileTemplate) {
        projectile = projectileTemplate.clone();
        projectile.position.set(0, 0, 0); // Start at camera
        scene.add(projectile);
    }
}

// Explosion effect
function explodeModel() {
    scene.remove(targetModel);
    const fragments = [];
    const fragmentGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2); // Simple placeholder
    const material = targetModel.children[0].material; // Reuse target's material
    for (let i = 0; i < 10; i++) {
        const fragment = new THREE.Mesh(fragmentGeometry, material);
        fragment.position.copy(targetModel.position);
        fragment.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5
        );
        scene.add(fragment);
        fragments.push(fragment);
    }
    setTimeout(() => {
        fragments.forEach(f => scene.remove(f));
    }, 1000);
}

// Load custom models (replace paths with your own)
function loadModels() {
    // Load target model with texture
    mtlLoader.load('path/to/your/target.mtl', (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load('path/to/your/target.obj', (object) => {
            targetTemplate = object;
            spawnTarget(); // Spawn first target
        });
    });

    // Load projectile model with texture
    mtlLoader.load('path/to/your/projectile.mtl', (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load('path/to/your/projectile.obj', (object) => {
            projectileTemplate = object;
        });
    });
}

// Game state
let modelSpeed = 0.05;
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Move target model
    if (targetModel) {
        targetModel.position.z -= modelSpeed;
        targetModel.rotation.x += 0.01;
        targetModel.rotation.y += 0.01;
        if (targetModel.position.z < -50) {
            scene.remove(targetModel);
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
        if (targetModel && projectile) {
            const distance = projectile.position.distanceTo(targetModel.position);
            if (distance < 1) { // Adjust distance based on model size
                explodeModel();
                scene.remove(projectile);
                projectile = null;
                setTimeout(spawnTarget, 1000);
            }
        }
    }

    renderer.render(scene, camera);
}

// Event listener for shooting
document.addEventListener('click', () => {
    if (!projectile && projectileTemplate) shoot();
});

// Start game
loadModels();
animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
