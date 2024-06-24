import * as THREE from 'three';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { min } from 'three/examples/jsm/nodes/Nodes.js';


let minTarget:THREE.Vector2 = new THREE.Vector2(0,0);
let maxTarget:THREE.Vector2 = new THREE.Vector2(0,0);

const c: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>('canvas')!;
console.log(c);

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
   canvas: c,
   alpha: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// SCENE
const scene: THREE.Scene = new THREE.Scene();

// CAMERA
const fov: number = 50;
const aspect: number = window.innerWidth / window.innerHeight;
const near: number = 0.1;
const far: number = 100;
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
   fov,
   aspect,
   near,
   far
);
camera.position.z = 10;

const maxMark: THREE.Mesh = new THREE.Mesh(
   new THREE.BoxGeometry(.3, .3, .3),
   new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
const minMark: THREE.Mesh = new THREE.Mesh(
   new THREE.BoxGeometry(.3, .3, .3),
   new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
const mouseMark: THREE.Mesh = new THREE.Mesh(
   new THREE.BoxGeometry(.3, .3, .3),
   new THREE.MeshBasicMaterial({ color: 0x0000ff })
);

const grid: THREE.GridHelper = new THREE.GridHelper();
grid.rotation.x = 3.14 / 2;

scene.add(camera);
scene.add(grid);
scene.add(maxMark);
scene.add(minMark);
scene.add(mouseMark);

function resize() {

   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();

   renderer.setSize(window.innerWidth, window.innerHeight);
   renderer.render(scene, camera);
   camera.getViewBounds(10, minTarget, maxTarget);

   console.table({minTarget, maxTarget});
   minMark.position.x = minTarget.x;
   maxMark.position.x = maxTarget.x;
};
resize();
window.onresize = resize;
renderer.setAnimationLoop(()=>{
   renderer.render(scene,camera);
});


c.addEventListener("mousemove", e=>{
   const mouseNormalized: THREE.Vector2 = new THREE.Vector2(
      e.x / window.innerWidth,
      e.y / window.innerHeight,);

   mouseMark.position.x = mouseNormalized.x * (maxTarget.x-minTarget.x) + minTarget.x;
   mouseMark.position.y = mouseNormalized.y * -(maxTarget.y-minTarget.y) - minTarget.y;
   console.log(mouseMark.position.x);
});
