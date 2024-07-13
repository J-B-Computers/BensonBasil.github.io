/* Background Animation
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

const canvas = document.getElementById('background-animation');
const gl = canvas.getContext('webgl2');

if (!gl) {
    console.error('WebGL2 not supported');
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Vertex shader source
const vsSource = `#version 300 es
    in vec4 a_position;
    void main() {
        gl_Position = a_position;
    }
`;

// Fragment shader source
const fsSource = `#version 300 es
    precision highp float;
    out vec4 fragColor;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    #define PI 3.14159265359

    float hash(float n) { return fract(sin(n) * 1e4); }
    float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

    float noise(vec2 x) {
        vec2 i = floor(x);
        vec2 f = fract(x);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 x) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 5; ++i) {
            v += a * noise(x);
            x = rot * x * 2.0 + shift;
            a *= 0.5;
        }
        return v;
    }

    vec3 nebula(vec2 p) {
        float t = u_time * 0.1;
        vec3 color = vec3(0.0);
        for(float i = 0.0; i < 3.0; i++) {
            vec2 q = vec2(0);
            q.x = fbm(p + 0.00 * t);
            q.y = fbm(p + vec2(1.0));
            vec2 r = vec2(0);
            r.x = fbm(p + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
            r.y = fbm(p + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);
            float f = fbm(p + r);
            color += mix(
                vec3(0.101961, 0.619608, 0.666667),
                vec3(0.666667, 0.666667, 0.498039),
                clamp((f * f) * 4.0, 0.0, 1.0)
            );
        }
        return color * 0.5;
    }

    float star(vec2 uv, float flare) {
        float d = length(uv);
        float m = 0.05 / d;
        float rays = max(0.0, 1.0 - abs(uv.x * uv.y * 1000.0));
        m += rays * flare;
        uv *= mat2(cos(PI * 0.25), sin(PI * 0.25), -sin(PI * 0.25), cos(PI * 0.25));
        rays = max(0.0, 1.0 - abs(uv.x * uv.y * 1000.0));
        m += rays * 0.3 * flare;
        m *= smoothstep(1.0, 0.2, d);
        return m;
    }

    void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
        
        // Nebula background
        vec3 color = nebula(uv * 3.0);
        
        // Star field
        vec2 mouse = (u_mouse - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
        for(int i = 0; i < 50; i++) {
            vec2 p = uv * mat2(cos(float(i) * 0.1), sin(float(i) * 0.1), -sin(float(i) * 0.1), cos(float(i) * 0.1));
            float s = star(p - mouse * 0.1, 0.5);
            color += vec3(s);
        }
        
        // Cosmic dust
        for(int i = 0; i < 5; i++) {
            float t = u_time * 0.1 + float(i) * 1234.5678;
            vec2 p = uv * mat2(cos(t * 0.1), sin(t * 0.1), -sin(t * 0.1), cos(t * 0.1));
            float dust = fbm(p * 10.0 + t);
            color += vec3(0.8, 0.7, 0.6) * dust * 0.1;
        }
        
        // Gamma correction
        color = pow(color, vec3(0.4545));
        
        fragColor = vec4(color, 1.0);
    }
`;

// Create shader program
function createShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    return program;
}

const shaderProgram = createShaderProgram(gl, vsSource, fsSource);
gl.useProgram(shaderProgram);

// Create a square
const positions = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    1, 1,
]);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

// Add uniforms
const uResolutionLocation = gl.getUniformLocation(shaderProgram, 'u_resolution');
const uTimeLocation = gl.getUniformLocation(shaderProgram, 'u_time');
const uMouseLocation = gl.getUniformLocation(shaderProgram, 'u_mouse');

let mouse = { x: 0, y: 0 };

function animate(time) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(uResolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(uTimeLocation, time * 0.001);
    gl.uniform2f(uMouseLocation, mouse.x, mouse.y);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = gl.canvas.height - event.clientY; // Flip Y coordinate
});

animate(0);