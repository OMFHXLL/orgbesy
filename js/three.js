import * as THREE from 'three';
import { GUI } from '../node_modules/dat.gui/build/dat.gui.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Создание сцены
const scene = new THREE.Scene();

// Создание камеры
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -15;
camera.position.y = 21.5;
camera.position.z = -22;


// Добавление рендерера
const renderer = new THREE.WebGLRenderer({ antialias: true });
const map = document.getElementById('map-canvas');
renderer.setSize(window.innerWidth, window.innerHeight);
map.appendChild(renderer.domElement);

// Добавление контролов для вращения модели
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2; // Ограничение вращения по вертикали
controls.target.set(0,.5,0);
controls.minDistance = 3; // Минимальное расстояние
controls.maxDistance = 40; // Максимальное расстояние



// Создаем объекты для хранения параметров камеры и контролов
const cameraParams = {
  positionX: -7,
  positionY: 10.5,
  positionZ: -15,
};

const targetParams = {
  targetX: -3,
  targetY: -1.7,
  targetZ: -3.2,
};

// Создаем панель dat.gui
const gui = new GUI();

// Добавляем параметры камеры на панель
const cameraFolder = gui.addFolder('Camera');
const positionXController = cameraFolder.add(cameraParams, 'positionX', -25, 25).name('Камера X').step(0.01).listen();
const positionYController = cameraFolder.add(cameraParams, 'positionY', 0, 40).name('Камера Y').step(0.01).listen();
const positionZController = cameraFolder.add(cameraParams, 'positionZ', -35, 15).name('Камера Z').step(0.01).listen();
cameraFolder.open();

// Добавляем параметры контролов на панель
const controlsFolder = gui.addFolder('LookAt');
const targetXController = controlsFolder.add(targetParams, 'targetX', -10, 10).name('Таргет X').step(0.01).listen();
const targetYController = controlsFolder.add(targetParams, 'targetY', -10, 30).name('Таргет Y').step(0.01).listen();
const targetZController = controlsFolder.add(targetParams, 'targetZ', -10, 10).name('Таргет Z').step(0.01).listen();
controlsFolder.open();

// Обновляем значение параметров камеры и контролов
function updateValues() {
  camera.position.set(cameraParams.positionX, cameraParams.positionY, cameraParams.positionZ);
  controls.target.set(targetParams.targetX, targetParams.targetY, targetParams.targetZ);
  controls.update();
}

// Вызываем функцию обновления значений при изменении параметров на панели
positionXController.onChange(updateValues);
positionYController.onChange(updateValues);
positionZController.onChange(updateValues);
targetXController.onChange(updateValues);
targetYController.onChange(updateValues);
targetZController.onChange(updateValues);

// Инициализируем начальные значения параметров и вызываем первичное обновление
updateValues();

controls.addEventListener('change', () => {
  cameraParams.positionX = camera.position.x;
  cameraParams.positionY = camera.position.y;
  cameraParams.positionZ = camera.position.z;
});



// // Загрузка 3D модели
const loader = new GLTFLoader();
loader.load(
    '1.glb', // Путь к модели
    function (gltf) {
        const model = gltf.scene;
        model.scale.set(2, 2, 2);
        scene.add(model);
    }
);
loader.load(
  'bar.gltf',
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0,-1.4,0);
    scene.add(model);
  }
);

const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

        // Анимация и обновление сцены
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  // Инициализируем начальные значения
}

animate();

window.addEventListener('resize', animate)