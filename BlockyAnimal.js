// import {Triangle} from './Triangle.js';

let ctx;

// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
let VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GloabalRotateMatrix;
void main() {
  gl_Position = u_GloabalRotateMatrix * u_ModelMatrix * a_Position;
}`;

// Fragment shader program
let FSHADER_SOURCE =`
precision mediump float;
uniform vec4 u_FragColor;
void main() {
  gl_FragColor = u_FragColor;
}
`;

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GloabalRotateMatrix;

function setUpWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl"); // , {preserveDrawingBuffer: true}
    if (!gl) {
        console.error('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);

    // CubeMesh.init();

    tick();
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to intialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.error('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.error('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_FragColor) {
        console.error('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GloabalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GloabalRotateMatrix');
    if (!u_GloabalRotateMatrix) {
        console.error('Failed to get the storage location of u_GloabalRotateMatrix');
        return;
    }

    let identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
    gl.uniformMatrix4fv(u_GloabalRotateMatrix, false, identityM.elements);    
}

let fpsElement;

function setUpElements() {
    fpsElement = document.getElementById("fps");
    document.getElementById('yawSlide').addEventListener('input', function() {g_globalYawAngle = -this.value;})
    document.getElementById('pitchSlide').addEventListener('input', function() {g_globalPitchAngle = -this.value;})
}

let rscalls = 0;

let animalModel;
let animalAnim;

function main() {
    setUpWebGL();

    connectVariablesToGLSL();

    setUpElements();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = move;

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
}

function clearScreen() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function renderScene() {

    rscalls++;

    clearScreen();

    const scale = 1/120;
    const globalRotMat = new Matrix4().scale(scale, scale, scale).rotate(g_globalPitchAngle, 1, 0, 0).rotate(g_globalYawAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GloabalRotateMatrix, false, globalRotMat.elements)
 
    // drawObjAndChildren(animalModel["minecraft:geometry"][0].bones, new Matrix4());
    
    for (const key in parts) {
        parts[key].render();
    }
}

let variable;
const parts = {};

function tick() {
    requestAnimationFrame(tick);

    g_seconds = performance.now()/1000.0-g_startTime
    
    parts.body = new Cube(0, 0, 0, 64, 24, 24);
    let tail = parts.body;
    for (let i = 0; i < 12; i++) {
        tail = tail.add(new Cube(37 + 10*i, 0, -2.5, 10, 10, 10, ));
        tail.add((new Cube(37 + 10*i, 0, 4.5, 6, 2, 4)).col(125, 125, 125, 255));
    }
    let neck = parts.body;
    for (let i = 0; i < 5; i++) {
        neck = neck.add(new Cube(-37 - 10*i, 0, -2.5, 10, 10, 10));
        neck.add((new Cube(-37 - 10*i, 0, 4.5, 6, 2, 4)).col(125, 125, 125, 255));
    }
    const head = neck.add(new Cube(-90, 0, -2.5, 16, 16, 16));
    head.add(new Cube(-90, 4, 7.5, 6, 2, 4)) // ear
    head.add(new Cube(-90, -4, 7.5, 6, 2, 4)) // ear
    head.add(new Cube(-106, 0, -4, 16, 12, 5)) // nose
    head.add(new Cube(-110, 4, -0.5, 4, 2, 2)) // nostril
    head.add(new Cube(-110, -4, -0.5, 4, 2, 2)) // nostril
    head.add(new Cube(-106, 0, -8.5, 16, 12, 4, -98, 0, -8.5, "(Math.sin(g_seconds*2)+1) * 8", 0, 1, 0)) // jaw TODO ANIMATE ME
    

    renderScene();
}

function sendTextToHTML(text, ID) {
    let htmlElm = document.getElementById(ID);
    htmlElm.innerHTML = text;
}

let g_points = [];
let g_selectedColor = [1, 1, 1, 1];
let g_globalYawAngle = -30;
let g_globalPitchAngle = -30;
let g_startTime = performance.now()/1000.0;
let g_seconds = performance.now()/1000.0-g_startTime;

function click(event) {
    console.error("Click event is not defined");
}
function move(event) {
    // console.error("Move event is not defined");
}

let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

function updateFPS(now) {
  frameCount++;

  const delta = now - lastTime;

  // Update FPS about once per second
  if (delta >= 1000) {
    fps = (frameCount * 1000) / delta;
    fpsElement.textContent = `FPS: ${fps.toFixed(1)}`;

    frameCount = 0;
    lastTime = now;

    console.log(rscalls);
    rscalls = 0;
  }

  requestAnimationFrame(updateFPS);
}

requestAnimationFrame(updateFPS);
