/* VERSION 1 Background Animation
const canvas = document.getElementById('background-animation');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const celestialObjects = [];
const starCount = 200;
const planetCount = 5;
const galaxyCount = 10;

let mouse = { x: null, y: null, radius: 50 };

// Create stars, planets, and galaxies
function createCelestialObjects() {
    // Create stars
    for (let i = 0; i < starCount; i++) {
        celestialObjects.push({
            type: 'star',
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            color: `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`,
            velocity: { x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.5 }
        });
    }

    // Create planets
    for (let i = 0; i < planetCount; i++) {
        celestialObjects.push({
            type: 'planet',
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 20 + 10,
            color: `hsl(${Math.random() * 360}, 50%, 50%)`,
            velocity: { x: (Math.random() - 0.5) * 0.2, y: (Math.random() - 0.5) * 0.2 }
        });
    }

    // Create galaxies
    for (let i = 0; i < galaxyCount; i++) {
        celestialObjects.push({
            type: 'galaxy',
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 100 + 50,
            color: `hsla(${Math.random() * 360}, 70%, 50%, 0.3)`,
            rotation: Math.random() * Math.PI * 2,
            velocity: { x: (Math.random() - 0.5) * 0.1, y: (Math.random() - 0.5) * 0.1 }
        });
    }
}

createCelestialObjects();

function drawSpaceBackground() {
    ctx.fillStyle = '#0a192f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    celestialObjects.forEach(object => {
        ctx.beginPath();

        if (object.type === 'star') {
            ctx.arc(object.x, object.y, object.radius, 0, Math.PI * 2);
            ctx.fillStyle = object.color;
            ctx.fill();
        } else if (object.type === 'planet') {
            ctx.arc(object.x, object.y, object.radius, 0, Math.PI * 2);
            ctx.fillStyle = object.color;
            ctx.fill();
        } else if (object.type === 'galaxy') {
            ctx.save();
            ctx.translate(object.x, object.y);
            ctx.rotate(object.rotation);
            ctx.beginPath();
            ctx.ellipse(0, 0, object.radius, object.radius / 2, 0, 0, Math.PI * 2);
            ctx.fillStyle = object.color;
            ctx.fill();
            ctx.restore();
        }

        // Black hole (mouse) interaction
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - object.x;
            let dy = mouse.y - object.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius + object.radius) {
                let angle = Math.atan2(dy, dx);
                object.x = mouse.x - Math.cos(angle) * (mouse.radius + object.radius);
                object.y = mouse.y - Math.sin(angle) * (mouse.radius + object.radius);
            }
        }

        // Move objects
        object.x += object.velocity.x;
        object.y += object.velocity.y;

        // Wrap around screen
        if (object.x < -object.radius) object.x = canvas.width + object.radius;
        if (object.x > canvas.width + object.radius) object.x = -object.radius;
        if (object.y < -object.radius) object.y = canvas.height + object.radius;
        if (object.y > canvas.height + object.radius) object.y = -object.radius;
    });

    // Draw shooting star
    if (Math.random() < 0.02) {
        let shootingStar = {
            x: Math.random() * canvas.width,
            y: 0,
            length: Math.random() * 80 + 20,
            speed: Math.random() * 10 + 5,
            angle: Math.random() * Math.PI / 4 + Math.PI / 4
        };
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
                   shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    requestAnimationFrame(drawSpaceBackground);
}

drawSpaceBackground();

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

*/
// VERSION 2: Note: This is a conceptual framework. Full implementation would require
// multiple files, advanced AI models, and extensive optimization.
/* Main script (ecosystem.js)
import { initializeWebGL, render } from './webgl.js';
import { initializeAI, evolveEcosystem } from './ai.js';
import { fetchGlobalData, processUserInteraction } from './dataProcessing.js';
import { Organism, Environment } from './entities.js';

const canvas = document.getElementById('ecosystem-canvas');
const gl = canvas.getContext('webgl2');

let ecosystem, environment, aiModel, globalData;

async function initialize() {
    initializeWebGL(gl);
    ecosystem = new Set();
    environment = new Environment();
    aiModel = await initializeAI();
    globalData = await fetchGlobalData();
    
    // Create initial organisms
    for (let i = 0; i < 1000; i++) {
        ecosystem.add(new Organism(environment));
    }

    // Set up Web Workers for parallel processing
    const workerCount = navigator.hardwareConcurrency || 4;
    const workers = [];
    for (let i = 0; i < workerCount; i++) {
        workers.push(new Worker('ecosystemWorker.js'));
    }

    animationLoop();
}

function animationLoop() {
    // Process global data influences
    environment.update(globalData);

    // Evolve ecosystem
    const evolvedEcosystem = evolveEcosystem(ecosystem, environment, aiModel);

    // Render the ecosystem
    render(gl, evolvedEcosystem, environment);

    // Schedule next frame
    requestAnimationFrame(animationLoop);
}

// Handle user interactions
canvas.addEventListener('interaction', (event) => {
    const influence = processUserInteraction(event);
    environment.applyInfluence(influence);
});

initialize();

// WebGL rendering (webgl.js)
export function initializeWebGL(gl) {
    // Set up WebGL context, shaders, etc.
}

export function render(gl, ecosystem, environment) {
    // Use WebGL to render the ecosystem
    // This would involve complex shaders for realistic rendering
    // of organisms, environment, and their interactions
}

// AI processing (ai.js)
export async function initializeAI() {
    // Load pre-trained AI model using TensorFlow.js
    const model = await tf.loadLayersModel('ecosystem_model.json');
    return model;
}

export function evolveEcosystem(ecosystem, environment, aiModel) {
    // Use AI to evolve the ecosystem
    // This would involve complex decision-making for each organism
    // based on its surroundings, the environment, and learned behaviors
}

// Data processing (dataProcessing.js)
export async function fetchGlobalData() {
    // Fetch real-time data from various APIs
    // This could include weather data, financial markets, social media trends, etc.
}

export function processUserInteraction(event) {
    // Process user interactions and determine their impact on the ecosystem
}

// Entities (entities.js)
export class Organism {
    constructor(environment) {
        this.dna = this.generateDNA();
        this.position = this.calculateInitialPosition(environment);
        this.energy = 100;
        this.age = 0;
    }

    generateDNA() {
        // Generate complex DNA structure that determines organism's characteristics
    }

    calculateInitialPosition(environment) {
        // Calculate a suitable initial position based on the environment
    }

    update(environment, nearbyOrganisms) {
        // Update organism's state based on its surroundings and internal state
    }

    reproduce(partner) {
        // Create a new organism with combined DNA
    }
}

export class Environment {
    constructor() {
        this.terrain = this.generateTerrain();
        this.climate = this.initializeClimate();
        this.resources = this.distributeResources();
    }

    generateTerrain() {
        // Generate complex, realistic terrain using noise algorithms
    }

    initializeClimate() {
        // Set up a dynamic climate system
    }

    distributeResources() {
        // Distribute resources across the environment
    }

    update(globalData) {
        // Update environment based on global data
    }

    applyInfluence(influence) {
        // Apply user or external influences to the environment
    }
}

// Web Worker (ecosystemWorker.js)
self.onmessage = function(e) {
    const { organisms, environment, aiModel } = e.data;
    const evolvedOrganisms = evolveOrganisms(organisms, environment, aiModel);
    self.postMessage(evolvedOrganisms);
};

function evolveOrganisms(organisms, environment, aiModel) {
    // Perform intensive calculations for organism evolution
    // This could involve genetic algorithms, neural networks, etc.
}


// VERSION 3: Initialize WebGL
const canvas = document.getElementById('cosmic-consciousness');
const gl = canvas.getContext('webgl2');

if (!gl) {
    console.error('WebGL2 not supported');
    document.body.innerHTML = 'WebGL2 is required for this experience.';
}

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    gl.viewport(0, 0, canvas.width, canvas.height);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Shader sources
const vertexShaderSource = `#version 300 es
    in vec4 a_position;
    in vec4 a_color;
    in float a_size;

    uniform mat4 u_matrix;
    uniform float u_time;

    out vec4 v_color;
    out vec2 v_position;

    void main() {
        float angle = u_time * 0.1 + a_position.x * 0.01 + a_position.y * 0.01;
        float x = a_position.x + sin(angle) * 10.0;
        float y = a_position.y + cos(angle) * 10.0;
        float z = a_position.z + sin(u_time * 0.2 + a_position.x * 0.02) * 20.0;

        gl_Position = u_matrix * vec4(x, y, z, 1.0);
        gl_PointSize = a_size * (1.0 + sin(u_time * 2.0 + a_position.x * 0.1) * 0.5);

        v_color = a_color;
        v_position = a_position.xy;
    }
`;

const fragmentShaderSource = `#version 300 es
    precision highp float;

    in vec4 v_color;
    in vec2 v_position;

    uniform float u_time;

    out vec4 outColor;

    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    vec2 hash( vec2 p ) {
        p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
        return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }

    float noise(vec2 p) {
        const float K1 = 0.366025404;
        const float K2 = 0.211324865;
        
        vec2 i = floor(p + (p.x+p.y)*K1);
        vec2 a = p - i + (i.x+i.y)*K2;
        vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
        vec2 b = a - o + K2;
        vec2 c = a - 1.0 + 2.0*K2;
        
        vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
        vec3 n = h*h*h*h * vec3(dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
        
        return dot(n, vec3(70.0));
    }

    float fbm(vec2 p) {
        float f = 0.0;
        float w = 0.5;
        for (int i = 0; i < 5; i ++) {
            f += w * noise(p);
            p = p * 2.0;
            w = w * 0.5;
        }
        return f;
    }

    void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float r = length(uv);
        float a = atan(uv.y, uv.x);

        float f = fbm(vec2(r * 10.0 + u_time * 0.1, a * 5.0));
        f = smoothstep(0.0, 1.0, f);

        float glow = exp(-r * 4.0);

        vec3 color = v_color.rgb * f * glow;
        color += pow(glow, 3.0) * vec3(0.7, 0.9, 1.0) * 0.5;

        float alpha = smoothstep(0.5, 0.0, r);

        outColor = vec4(color, alpha * v_color.a);
    }
`;

// Create shader program
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

// Get attribute and uniform locations
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
const sizeAttributeLocation = gl.getAttribLocation(program, 'a_size');
const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');
const timeUniformLocation = gl.getUniformLocation(program, 'u_time');

// Create buffers
const positionBuffer = gl.createBuffer();
const colorBuffer = gl.createBuffer();
const sizeBuffer = gl.createBuffer();

// Create VAO
const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

// Set up attributes
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.enableVertexAttribArray(colorAttributeLocation);
gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
gl.enableVertexAttribArray(sizeAttributeLocation);
gl.vertexAttribPointer(sizeAttributeLocation, 1, gl.FLOAT, false, 0, 0);

// Generate particle data
const PARTICLE_COUNT = 100000;
const positions = new Float32Array(PARTICLE_COUNT * 3);
const colors = new Float32Array(PARTICLE_COUNT * 4);
const sizes = new Float32Array(PARTICLE_COUNT);

for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const i4 = i * 4;

    // Position
    positions[i3] = (Math.random() - 0.5) * 1000;
    positions[i3 + 1] = (Math.random() - 0.5) * 1000;
    positions[i3 + 2] = (Math.random() - 0.5) * 1000;

    // Color
    colors[i4] = Math.random();
    colors[i4 + 1] = Math.random();
    colors[i4 + 2] = Math.random();
    colors[i4 + 3] = Math.random() * 0.5 + 0.5;

    // Size
    sizes[i] = Math.random() * 10 + 1;
}

// Upload data to GPU
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);

// Set up matrix
const fieldOfView = Math.PI / 4;
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
const zNear = 1;
const zFar = 2000;
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

// Animation loop
let then = 0;
function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    gl.useProgram(program);
    gl.bindVertexArray(vao);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Compute matrix
    const viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, [0, 0, -600]);
    mat4.rotate(viewMatrix, viewMatrix, now * 0.1, [0, 1, 0]);

    const viewProjectionMatrix = mat4.create();
    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

    // Set uniforms
    gl.uniformMatrix4fv(matrixUniformLocation, false, viewProjectionMatrix);
    gl.uniform1f(timeUniformLocation, now);

    // Draw
    gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);

// Interaction
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / canvas.width) * 2 - 1;
    mouseY = -(event.clientY / canvas.height) * 2 + 1;
});

canvas.addEventListener('touchmove', (event) => {
    event.preventDefault();
    mouseX = (event.touches[0].clientX / canvas.width) * 2 - 1;
    mouseY = -(event.touches[0].clientY / canvas.height) * 2 + 1;
});

VERSION 5: */
const canvas = document.getElementById('background-animation');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 900;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                color: `rgba(100, 255, 218, ${Math.random() * 0.5 + 0.1})`,
                speed: Math.random() * 0.2 + 0.1
            });
        }

        function drawParticles(mouseX, mouseY) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();

                particle.x += particle.speed * (mouseX - canvas.width / 2) / 100;
                particle.y += particle.speed * (mouseY - canvas.height / 2) / 100;

                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
            });

            requestAnimationFrame(() => drawParticles(mouseX, mouseY));
        }

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        drawParticles(mouseX, mouseY);