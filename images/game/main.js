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

// Default geometries and materials
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const projectileGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const projectileMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

// Game objects
let targetModel;
let targetTemplate; // Custom model or default cube
let projectile;
let projectileTemplate; // Custom projectile or default sphere
let useCustomModels = false; // Flag for custom model usage

// Spawn target
function spawnTarget() {
    if (targetTemplate) {
        targetModel = targetTemplate.clone();
        targetModel.position.set(0, 0, -10);
        scene.add(targetModel);
    }
}

// Shoot projectile
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
    const fragmentGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = useCustomModels && targetModel.children[0].material ? targetModel.children[0].material : cubeMaterial;
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

// Load custom models with fallback
function loadModels() {
    // Default to basic shapes
    targetTemplate = new THREE.Mesh(cubeGeometry, cubeMaterial);
    projectileTemplate = new THREE.Mesh(projectileGeometry, projectileMaterial);
    spawnTarget(); // Start with default

    // Attempt to load custom target model
    mtlLoader.load('models/target.mtl', (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load('models/target.obj', (object) => {
            useCustomModels = true;
            targetTemplate = object;
            scene.remove(targetModel); // Remove default if loaded
            spawnTarget();
        }, undefined, (error) => {
            console.log('Target model not found, using default cube:', error);
        });
    }, undefined, (error) => {
        console.log('Target MTL not found, skipping:', error);
    });

    // Attempt to load custom projectile model
    mtlLoader.load('models/projectile.mtl', (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load('models/projectile.obj', (object) => {
            projectileTemplate = object;
        }, undefined, (error) => {
            console.log('Projectile model not found, using default sphere:', error);
        });
    }, undefined, (error) => {
        console.log('Projectile MTL not found, skipping:', error);
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
            if (distance < 1) {
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
