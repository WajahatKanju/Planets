import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";


import milkyStarsTexture from './static/img/8k_stars_milky_way.jpg'
import sunTexture from './static/img/8k_sun.jpg';
import mercuryTexture from './static/img/8k_mercury.jpg';
import venusTexture from './static/img/4k_venus_atmosphere.jpg';
import earthTexture from './static/img/8k_earth_daymap.jpg';
import marsTexture from './static/img/8k_mars.jpg';
import jupiterTexture from './static/img/8k_jupiter.jpg';
import saturnTexture from './static/img/8k_saturn.jpg';
// import saturnRing from './static/img/8k_saturn_ring_alpha.png';
import uranusTexture from './static/img/8k_saturn.jpg';
import neptuneTexture from './static/img/2k_neptune.jpg'
import plutoTexture from './static/img/plutomap2k.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90, 140, 240);
orbit.update()


const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.load([
    milkyStarsTexture, milkyStarsTexture,
    milkyStarsTexture, milkyStarsTexture,
    milkyStarsTexture, milkyStarsTexture
]);

scene.background = cubeTexture;

const textureLoader = new THREE.TextureLoader();

const sunLight = new THREE.PointLight(0xFFFFFF, 1, 10000);

const sunGeometry = new THREE.SphereGeometry(100, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0,0,0)
sun.add(sunLight)
scene.add(sun);


function createSatellite(radius, texture, position, orbitRadius, orbitSpeed) {
    // create a planet mesh with a texture and orbit around the sun
    const satelliteGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const satelliteMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
    satellite.position.set(position.x + orbitRadius , position.y, position.z);

    const planetOrbit = new THREE.Object3D();
    scene.add(planetOrbit); // add the orbit to the scene

    return [satellite, planetOrbit, orbitSpeed];
}

const planets = {
    'mercury': {
        'radius': 0.383,
        'texture': mercuryTexture,
        'position': {
            'x': 35,
            'y': 0,
            'z': 100
        },
        'rotationSpeed': 0.05,
        'orbitRadius': 135,
        'orbitSpeed': 0.47
    },
    'venus': {
        'radius': 0.949,
        'texture': venusTexture,
        'position': {
            'x': 0,
            'y': 0,
            'z': 150
        },
        'rotationSpeed': -0.005,
        'orbitRadius': 150,
        'orbitSpeed': 0.35
    },
    'earth': {
        'radius': 1,
        'texture': earthTexture,
        'position': {
            'x': 0,
            'y': 0,
            'z': 200
        },
        'rotationSpeed': 0.005,
        'orbitRadius': 200,
        'orbitSpeed': 0.29
    },
    'mars': {
        'radius': 0.532,
        'texture': marsTexture,
        'position': {
            'x': 0,
            'y': 0,
            'z': 250
        },
        'rotationSpeed': 0.005,
        'orbitRadius': 250,
        'orbitSpeed': 0.24
    },
    'jupiter': {
        'radius': 11.21,
        'texture': jupiterTexture,
        'position': {
            'x': 0,
            'y': 0,
            'z': 350
        },
        'rotationSpeed': -0.005,
        'orbitRadius': 350,
        'orbitSpeed': 0.013
    },
    'saturn': {
        'radius': 9.45,
        'texture': saturnTexture,
        'position': {
            'x': 0,
            'y': 0,
            'z': 450
        },
        'rotationSpeed': 0.005,
        'orbitRadius': 450,
        'orbitSpeed': 0.097
    },
    'uranus': {
        'radius': 4,
        'texture': uranusTexture,
        'position': {
            'x': 0,
            'y': 0,
            'z': 550
        },
        'rotationSpeed': 0.005,
        'orbitRadius': 550,
        'orbitSpeed': 0.068
    },
    'neptune': {
        'radius': 3.88,
        'texture': neptuneTexture,
        'position': {
            'x': 0,
            'y': 0,
            'z': 650
        },
        'rotationSpeed': -0.005,
        'orbitRadius': 650,
        'orbitSpeed': 0.054
    },

}


Object.values(planets).forEach((planetData) => {
    const [planet, planetOrbit, planetOrbitSpeed] = createSatellite(planetData.radius*2.5, planetData.texture, {
        'x': planetData.position.x,
        'y': planetData.position.y,
        'z': planetData.position.z
    }, planetData.orbitRadius, planetData.orbitSpeed);

    planetData['planetOrbit'] = planetOrbit;
    planetData['planet'] = planet;
    planetOrbit.add(planet)

})
function animate() {
    requestAnimationFrame(animate);

    Object.values(planets).forEach((planetData) => {
        const { planet, planetOrbit } = planetData;

        // Calculate new position of planet
        planetOrbit.rotation.y += planetData.orbitSpeed* 0.0001;



        planet.rotation.y += 0.01 * planetData.rotationSpeed;
    });

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
})

