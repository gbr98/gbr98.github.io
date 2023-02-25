import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {ConvexGeometry} from '../build/jsm/geometries/ConvexGeometry.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        initDefaultSpotlight,
        createGroundPlane,
        onWindowResize, 
        degreesToRadians} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

var renderer = initRenderer();    // View function in util/utils
renderer.setClearColor("rgb(30, 30, 40)");
//var camera = initCamera(new THREE.Vector3(15, 0, 0)); // Init camera in this position
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(5,15,30);
  camera.up.set( 0, 1, 0 );

var light = initDefaultSpotlight(scene, new THREE.Vector3(25, 30, 20)); // Use default light

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlane(50, 50); // width and height
  groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
axesHelper.visible = false;
scene.add( axesHelper );

// To use the keyboard
var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Object Material for all objects
var objectMaterial = new THREE.MeshPhongMaterial({color:"rgb(255,0,0)"});

function colorMaterial(color){
  return new THREE.MeshPhongMaterial({color:color});
}


let speed = 1;
let animationOn = true;
let propellers = []

scene.add(buildBase());
scene.add(buildTower());
scene.add(buildEngine());
scene.add(buildCapsule());
propellers.push(buildPropeller(0.0));
propellers.push(buildPropeller(2*Math.PI/3));
propellers.push(buildPropeller(-2*Math.PI/3));

for(let i = 0; i < propellers.length; i++){
  scene.add(propellers[i]);
}

function buildBase(){

  let geometry = new THREE.BoxGeometry(3, 0.4, 3);
  let object = new THREE.Mesh(geometry, colorMaterial("rgb(150,150,200)"));
  object.castShadow = true;
  object.position.set(0.0, 0.2, 0.0);

  let baseGeomety = new THREE.CylinderGeometry(0.7, 1.2, 0.6, 20, 40, false);
  let baseObject = new THREE.Mesh(baseGeomety, colorMaterial("rgb(100,100,200)"));
  baseObject.position.set(0.0, 0.3, 0.0);
  object.add(baseObject);

  return object;
}

function buildTower(){
  let geometry = new THREE.CylinderGeometry(0.4, 0.6, 10, 20, 40, false);
  let object = new THREE.Mesh(geometry, colorMaterial("rgb(100,100,100)"));
    object.castShadow = true;
    object.position.set(0.0, 10/2.0, 0.0);

  return object;
}

function buildEngine(){
  let geometry = new THREE.CylinderGeometry(0.5, 0.7, 3, 20, 40, false);
  let object = new THREE.Mesh(geometry, colorMaterial("rgb(100,100,200)"));
    object.castShadow = true;
    object.position.set(0.0, 10.5, 0.0);
    object.rotateX(-Math.PI/2);

  return object;
}

function buildCapsule(){
  let geometry = new THREE.SphereGeometry(0.3, 20, 20, 0, Math.PI * 2, 0, Math.PI);
  let object = new THREE.Mesh(geometry, colorMaterial("rgb(100,100,200)"));
    object.castShadow = true;
    object.position.set(0.0, 10.5, 1.5);
    object.scale.set(1,1,2)

  return object;
}

function buildPropeller(rotationZ){

  let localPoints = [
    new THREE.Vector3(0.0, 0.0, 0.0),
    new THREE.Vector3(0.2, 0.0, 0.0),
    new THREE.Vector3(0.0, 0.0, 0.2),
    new THREE.Vector3(0.2, 0.0, 0.2),

    new THREE.Vector3(0.0, 1.0, 0.0),
    new THREE.Vector3(0.8, 1.0, 0.0),
    new THREE.Vector3(0.0, 1.0, 0.4),
    new THREE.Vector3(0.8, 1.0, 0.4),

    new THREE.Vector3(0.1, 6.0, 0.1),
  ];

  let convexGeometry = new ConvexGeometry(localPoints);
  let holder = new THREE.Object3D();

  let object = new THREE.Mesh(convexGeometry, colorMaterial("rgb(255,150,150)"));
      object.castShadow = true;
      object.visible = true;
      object.rotateOnAxis(new THREE.Vector3(0,0,1), rotationZ);
      object.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI/4);
      holder.add(object);
      holder.position.set(0, 10.5, 1.7);
  
  return holder;
}

buildInterface();
render();

function buildInterface() {
  var controls = new function () {
    this.onChangeAnimation = function () {
      animationOn = !animationOn;
    };
    this.speed = 1;
    this.changeSpeed = function () {
      speed = this.speed;
    };
  };
  var gui = new GUI();
  gui.add(controls, 'onChangeAnimation', true).name("Animation On/Off");
  gui.add(controls, 'speed', 1, 5)
    .onChange(function (e) { controls.changeSpeed() })
    .name("Change Speed");
}

function render()
{
  stats.update(); // Update FPS
  update();
  trackballControls.update();
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
}

function update(){
  if(animationOn){
    propellers.forEach(propeller => {
      propeller.rotateOnAxis(new THREE.Vector3(0,0,1), -speed*0.05);
    });
  }
}


// function createIcosahedron(radius, detail)
// {
//   var geometry = new THREE.IcosahedronGeometry(radius, detail);
//   var object = new THREE.Mesh(geometry, objectMaterial);
//     object.castShadow = true;
//     object.position.set(0.0, radius, 0.0);
//     object.visible = false;

//   objectArray.push(object);
//   return object;
// }

// function createTorus(radius, tube, radialSegments, tubularSegments, arc)
// {
//   var geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
//   var object = new THREE.Mesh(geometry, objectMaterial);
//     object.castShadow = true;
//     object.position.set(0.0, radius+tube, 0.0);
//     object.visible = false;

//   objectArray.push(object);
//   return object;
// }

// function createCylinder(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded)
// {
//   var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded);
//   var object = new THREE.Mesh(geometry, objectMaterial);
//     object.castShadow = true;
//     object.position.set(0.0, height/2.0, 0.0);
//     object.visible = false;

//   objectArray.push(object);
//   return object;
// }

// function createSphere(radius, widthSegments, heightSegments)
// {
//   var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, Math.PI * 2, 0, Math.PI);
//   var object = new THREE.Mesh(geometry, objectMaterial);
//     object.castShadow = true;
//     object.position.set(0.0, radius, 0.0);
//     object.visible = false;

//   objectArray.push(object);
//   return object;
// }

// function createCube(s)
// {
//   var geometry = new THREE.BoxGeometry(s, s, s);
//   var object = new THREE.Mesh(geometry, objectMaterial);
//     object.castShadow = true;
//     object.position.set(0.0, s/2.0, 0.0);
//     object.visible = true;

//   objectArray.push(object);
//   return object;
// }