import * as THREE from "//cdn.skypack.dev/three@0.134?min";
import { OrbitControls } from "//cdn.skypack.dev/three@0.134/examples/jsm/controls/OrbitControls?min";
import * as CANNON from "https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js";

// code adapted from https://youtu.be/mTPDaw2piKg?si=HaLamPNp7Q313lxA

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Scene & Camera Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4, 10);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// Lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 50, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Physics World Setup
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.81, 0) });

// Ground Plane (Visible)
const planeGeo = new THREE.PlaneGeometry(10, 10);
const planeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const planeMesh = new THREE.Mesh(planeGeo, planeMat);
planeMesh.receiveShadow = true;
scene.add(planeMesh);

const planePhysMat = new CANNON.Material();
const planeBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(new CANNON.Vec3(5, 5, 0.001)),
  material: planePhysMat,
});
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBody);

// Create Invisible Box Walls
function createWall(position, size) {
  // Create an invisible material
  const wallMat = new THREE.MeshStandardMaterial({ visible: false });

  // Create the wall mesh (invisible)
  const wallGeo = new THREE.BoxGeometry(size.x * 2, size.y * 2, size.z * 2);
  const wallMesh = new THREE.Mesh(wallGeo, wallMat);
  wallMesh.position.set(position.x, position.y, position.z);
  scene.add(wallMesh);

  // Create the physics body (keeps collisions active)
  const wallBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(size.x, size.y, size.z)),
  });
  wallBody.position.set(position.x, position.y, position.z);
  world.addBody(wallBody);
}

// Define the box boundaries
const boxSize = { width: 5, height: 5, depth: 5 };

createWall({ x: 0, y: -boxSize.height, z: 0 }, { x: boxSize.width, y: 0.1, z: boxSize.depth }); // Bottom
createWall({ x: 0, y: boxSize.height, z: 0 }, { x: boxSize.width, y: 0.1, z: boxSize.depth }); // Top
createWall({ x: -boxSize.width, y: 0, z: 0 }, { x: 0.1, y: boxSize.height, z: boxSize.depth }); // Left
createWall({ x: boxSize.width, y: 0, z: 0 }, { x: 0.1, y: boxSize.height, z: boxSize.depth }); // Right
createWall({ x: 0, y: 0, z: -boxSize.depth }, { x: boxSize.width, y: boxSize.height, z: 0.1 }); // Back
createWall({ x: 0, y: 0, z: boxSize.depth }, { x: boxSize.width, y: boxSize.height, z: 0.1 }); // Front

// Mouse Interaction Setup
const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, intersectionPoint);
});

const meshes = [];
const bodies = [];

window.addEventListener("click", () => {
  const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: Math.random() * 0xffffff,
    metalness: 0,
    roughness: 0,
  });
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  sphereMesh.castShadow = true;
  scene.add(sphereMesh);

  const spherePhysMat = new CANNON.Material();
  const sphereBody = new CANNON.Body({
    mass: 0.3,
    shape: new CANNON.Sphere(0.125),
    position: new CANNON.Vec3(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z),
    material: spherePhysMat,
  });

  // Apply random velocity for varied bounce angles
  sphereBody.velocity.set(
    (Math.random() - 0.5) * 3, // X velocity (random left/right)
    Math.random() * 5,         // Y velocity (random upward push)
    (Math.random() - 0.5) * 3  // Z velocity (random forward/backward)
  );

  world.addBody(sphereBody);

  // Increase restitution (bounciness)
  world.addContactMaterial(new CANNON.ContactMaterial(planePhysMat, spherePhysMat, { restitution: 0.8 }));

  meshes.push(sphereMesh);
  bodies.push(sphereBody);
});


// Animation Loop
const timestep = 1 / 60;
function animate() {
  world.step(timestep);

  planeMesh.position.copy(planeBody.position);
  planeMesh.quaternion.copy(planeBody.quaternion);

  for (let i = 0; i < meshes.length; i++) {
    meshes[i].position.copy(bodies[i].position);
    meshes[i].quaternion.copy(bodies[i].quaternion);
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// Handle Window Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
