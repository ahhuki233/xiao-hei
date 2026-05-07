// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2.5, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

// Toon lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
mainLight.position.set(5, 10, 5);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0xffeedd, 0.3);
fillLight.position.set(-5, 3, 3);
scene.add(fillLight);

// Toon materials - painted look like reference
const furGray = new THREE.MeshToonMaterial({ color: 0x6b5b4b });
const furDark = new THREE.MeshToonMaterial({ color: 0x3d3530 });
const furLight = new THREE.MeshToonMaterial({ color: 0x9a8a78 });
const furCream = new THREE.MeshToonMaterial({ color: 0xe8ddd0 });
const pinkMat = new THREE.MeshToonMaterial({ color: 0xffaaaa });
const noseMat = new THREE.MeshToonMaterial({ color: 0x4a3535 });
const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.05 });
const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 });
const irisColor = new THREE.MeshStandardMaterial({ color: 0xeebb33, roughness: 0.1, metalness: 0.15 });

const cat = new THREE.Group();

// === BODY - Standing pose ===
const bodyGeo = new THREE.SphereGeometry(1, 32, 32);
bodyGeo.scale(0.7, 0.6, 1.0);
const body = new THREE.Mesh(bodyGeo, furGray);
body.position.set(0, 1.1, 0);
body.castShadow = true;
cat.add(body);

// Chest/front body
const chestGeo = new THREE.SphereGeometry(0.5, 32, 32);
chestGeo.scale(0.7, 0.7, 0.6);
const chestBody = new THREE.Mesh(chestGeo, furGray);
chestBody.position.set(0, 1.15, 0.5);
cat.add(chestBody);

// Belly (lighter)
const bellyGeo = new THREE.SphereGeometry(0.45, 32, 32);
bellyGeo.scale(0.65, 0.5, 0.7);
const belly = new THREE.Mesh(bellyGeo, furCream);
belly.position.set(0, 0.95, 0.3);
cat.add(belly);

// Back/hip area
const hipGeo = new THREE.SphereGeometry(0.55, 32, 32);
hipGeo.scale(0.75, 0.65, 0.7);
const hip = new THREE.Mesh(hipGeo, furGray);
hip.position.set(0, 1.05, -0.5);
cat.add(hip);

// === STRIPES on body ===
function addStripe(points, thickness) {
    const curve = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(curve, 16, thickness, 8, false);
    cat.add(new THREE.Mesh(geo, furDark));
}

// Back stripes
for (let i = 0; i < 5; i++) {
    const z = -0.4 + i * 0.22;
    addStripe([
        new THREE.Vector3(-0.35, 1.35, z),
        new THREE.Vector3(0, 1.48, z),
        new THREE.Vector3(0.35, 1.35, z)
    ], 0.035);
}

// Side stripes
for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 4; i++) {
        const z = -0.3 + i * 0.25;
        addStripe([
            new THREE.Vector3(side * 0.4, 1.3, z),
            new THREE.Vector3(side * 0.58, 1.1, z),
            new THREE.Vector3(side * 0.62, 0.9, z)
        ], 0.025);
    }
}

// === LEGS - All four visible ===
const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.6, 16);
const footGeo = new THREE.SphereGeometry(0.14, 24, 24);
footGeo.scale(1.1, 0.5, 1.3);

// Front left leg
const frontLeftLeg = new THREE.Mesh(legGeo, furGray);
frontLeftLeg.position.set(-0.28, 0.55, 0.55);
cat.add(frontLeftLeg);

const frontLeftFoot = new THREE.Mesh(footGeo, furCream);
frontLeftFoot.position.set(-0.28, 0.22, 0.6);
cat.add(frontLeftFoot);

// Front right leg
const frontRightLeg = new THREE.Mesh(legGeo, furGray);
frontRightLeg.position.set(0.28, 0.55, 0.55);
cat.add(frontRightLeg);

const frontRightFoot = new THREE.Mesh(footGeo, furCream);
frontRightFoot.position.set(0.28, 0.22, 0.6);
cat.add(frontRightFoot);

// Back left leg (thicker thigh)
const backLegGeo = new THREE.CylinderGeometry(0.15, 0.1, 0.55, 16);
const backLeftLeg = new THREE.Mesh(backLegGeo, furGray);
backLeftLeg.position.set(-0.3, 0.52, -0.5);
cat.add(backLeftLeg);

const backLeftFoot = new THREE.Mesh(footGeo, furCream);
backLeftFoot.position.set(-0.3, 0.22, -0.45);
cat.add(backLeftFoot);

// Back right leg
const backRightLeg = new THREE.Mesh(backLegGeo, furGray);
backRightLeg.position.set(0.3, 0.52, -0.5);
cat.add(backRightLeg);

const backRightFoot = new THREE.Mesh(footGeo, furCream);
backRightFoot.position.set(0.3, 0.22, -0.45);
cat.add(backRightFoot);

// Leg stripes
for (let side = -1; side <= 1; side += 2) {
    // Front leg stripes
    for (let i = 0; i < 2; i++) {
        addStripe([
            new THREE.Vector3(side * 0.28 - 0.08, 0.65 - i * 0.2, 0.55),
            new THREE.Vector3(side * 0.28, 0.6 - i * 0.2, 0.62),
            new THREE.Vector3(side * 0.28 + 0.08, 0.65 - i * 0.2, 0.55)
        ], 0.018);
    }
    // Back leg stripes
    for (let i = 0; i < 2; i++) {
        addStripe([
            new THREE.Vector3(side * 0.3 - 0.08, 0.65 - i * 0.2, -0.5),
            new THREE.Vector3(side * 0.3, 0.6 - i * 0.2, -0.42),
            new THREE.Vector3(side * 0.3 + 0.08, 0.65 - i * 0.2, -0.5)
        ], 0.018);
    }
}

// Paw pads on all feet
const padGeo = new THREE.SphereGeometry(0.06, 16, 16);
padGeo.scale(1, 0.35, 1.1);
const pawPositions = [
    { x: -0.28, z: 0.6 },   // front left
    { x: 0.28, z: 0.6 },    // front right
    { x: -0.3, z: -0.45 },  // back left
    { x: 0.3, z: -0.45 }    // back right
];
pawPositions.forEach(pos => {
    const pad = new THREE.Mesh(padGeo, pinkMat);
    pad.position.set(pos.x, 0.05, pos.z + 0.05);
    cat.add(pad);

    // Toe beans
    for (let t = 0; t < 3; t++) {
        const toeGeo = new THREE.SphereGeometry(0.025, 12, 12);
        toeGeo.scale(1, 0.4, 1);
        const toe = new THREE.Mesh(toeGeo, pinkMat);
        toe.position.set(pos.x + (t - 1) * 0.04, 0.04, pos.z + 0.12);
        cat.add(toe);
    }
});

// === HEAD - Cute toon proportions ===
const headGeo = new THREE.SphereGeometry(0.65, 32, 32);
headGeo.scale(1, 0.95, 0.9);
const head = new THREE.Mesh(headGeo, furGray);
head.position.set(0, 1.85, 0.65);
head.castShadow = true;
cat.add(head);

// Cheeks (puffy)
for (let side = -1; side <= 1; side += 2) {
    const cheekGeo = new THREE.SphereGeometry(0.22, 24, 24);
    cheekGeo.scale(0.85, 0.75, 0.6);
    const cheek = new THREE.Mesh(cheekGeo, furLight);
    cheek.position.set(side * 0.35, 1.72, 1.0);
    cat.add(cheek);
}

// Muzzle
const muzzleGeo = new THREE.SphereGeometry(0.25, 24, 24);
muzzleGeo.scale(1, 0.6, 0.65);
const muzzle = new THREE.Mesh(muzzleGeo, furCream);
muzzle.position.set(0, 1.7, 1.08);
cat.add(muzzle);

// Forehead stripes (M pattern)
addStripe([
    new THREE.Vector3(-0.25, 1.9, 1.02),
    new THREE.Vector3(-0.12, 2.08, 1.12),
    new THREE.Vector3(-0.02, 2.0, 1.15)
], 0.022);
addStripe([
    new THREE.Vector3(0.25, 1.9, 1.02),
    new THREE.Vector3(0.12, 2.08, 1.12),
    new THREE.Vector3(0.02, 2.0, 1.15)
], 0.022);

// Forehead center stripe
addStripe([
    new THREE.Vector3(0, 2.0, 1.15),
    new THREE.Vector3(0, 2.15, 1.05),
    new THREE.Vector3(0, 2.25, 0.9)
], 0.018);

// Cheek stripes
for (let side = -1; side <= 1; side += 2) {
    addStripe([
        new THREE.Vector3(side * 0.38, 1.82, 1.0),
        new THREE.Vector3(side * 0.5, 1.72, 0.88),
        new THREE.Vector3(side * 0.55, 1.62, 0.75)
    ], 0.015);
    addStripe([
        new THREE.Vector3(side * 0.35, 1.75, 1.02),
        new THREE.Vector3(side * 0.48, 1.65, 0.9),
        new THREE.Vector3(side * 0.52, 1.55, 0.78)
    ], 0.012);
}

// === EYES - Big and cute ===
const eyeSize = 0.14;

for (let side = -1; side <= 1; side += 2) {
    // Eye white
    const eyeWhiteGeo = new THREE.SphereGeometry(eyeSize, 32, 32);
    eyeWhiteGeo.scale(1, 0.95, 0.6);
    const eyeWhite = new THREE.Mesh(eyeWhiteGeo, whiteMat);
    eyeWhite.position.set(side * 0.2, 1.9, 1.18);
    cat.add(eyeWhite);

    // Iris
    const irisGeo = new THREE.SphereGeometry(0.09, 32, 32);
    const iris = new THREE.Mesh(irisGeo, irisColor);
    iris.position.set(side * 0.2, 1.9, 1.26);
    cat.add(iris);

    // Pupil (cat slit)
    const pupilGeo = new THREE.SphereGeometry(0.045, 16, 16);
    pupilGeo.scale(0.35, 1.1, 1);
    const pupil = new THREE.Mesh(pupilGeo, blackMat);
    pupil.position.set(side * 0.2, 1.9, 1.31);
    cat.add(pupil);

    // Highlight (big)
    const hl1 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), whiteMat);
    hl1.position.set(side * 0.2 - side * 0.035, 1.93, 1.32);
    cat.add(hl1);

    // Highlight (small)
    const hl2 = new THREE.Mesh(new THREE.SphereGeometry(0.015, 10, 10), whiteMat);
    hl2.position.set(side * 0.2 + side * 0.02, 1.87, 1.31);
    cat.add(hl2);

    // Eyelid - thinner, less puffy
    const lidGeo = new THREE.SphereGeometry(eyeSize + 0.01, 32, 16, 0, Math.PI * 2, 0, Math.PI / 4);
    const lid = new THREE.Mesh(lidGeo, furGray);
    lid.position.set(side * 0.2, 1.97, 1.18);
    lid.rotation.x = 0.1;
    lid.scale.set(1.05, 0.45, 0.7);
    cat.add(lid);

    // Eye outline - thinner
    const outlineGeo = new THREE.TorusGeometry(eyeSize - 0.01, 0.008, 12, 32);
    const outline = new THREE.Mesh(outlineGeo, furDark);
    outline.position.set(side * 0.2, 1.9, 1.16);
    cat.add(outline);
}

// === NOSE ===
const noseGeo = new THREE.SphereGeometry(0.055, 24, 24);
noseGeo.scale(1.15, 0.75, 0.8);
const nose = new THREE.Mesh(noseGeo, noseMat);
nose.position.set(0, 1.74, 1.3);
cat.add(nose);

// Nose shine
const noseShine = new THREE.Mesh(
    new THREE.SphereGeometry(0.018, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0x666666 })
);
noseShine.position.set(-0.012, 1.755, 1.34);
cat.add(noseShine);

// === MOUTH ===
const mouthCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.07, 1.64, 1.24),
    new THREE.Vector3(0, 1.62, 1.27),
    new THREE.Vector3(0.07, 1.64, 1.24)
]);
const mouthGeo = new THREE.TubeGeometry(mouthCurve, 16, 0.01, 8, false);
cat.add(new THREE.Mesh(mouthGeo, furDark));

// Mouth center line
const mouthLine = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.008, 0.07, 8),
    furDark
);
mouthLine.position.set(0, 1.665, 1.26);
cat.add(mouthLine);

// === EARS ===
const earGeo = new THREE.ConeGeometry(0.17, 0.38, 32);

const leftEar = new THREE.Mesh(earGeo, furGray);
leftEar.position.set(-0.32, 2.4, 0.55);
leftEar.rotation.x = 0.15;
leftEar.rotation.z = -0.18;
cat.add(leftEar);

const rightEar = new THREE.Mesh(earGeo, furGray);
rightEar.position.set(0.32, 2.4, 0.55);
rightEar.rotation.x = 0.15;
rightEar.rotation.z = 0.18;
cat.add(rightEar);

// Inner ears
const innerEarGeo = new THREE.ConeGeometry(0.1, 0.24, 32);
for (let side = -1; side <= 1; side += 2) {
    const inner = new THREE.Mesh(innerEarGeo, pinkMat);
    inner.position.set(side * 0.32, 2.35, 0.62);
    inner.rotation.x = 0.15;
    inner.rotation.z = side * -0.18;
    cat.add(inner);
}

// Ear stripes
for (let side = -1; side <= 1; side += 2) {
    addStripe([
        new THREE.Vector3(side * 0.32, 2.2, 0.5),
        new THREE.Vector3(side * 0.32, 2.35, 0.48),
        new THREE.Vector3(side * 0.32, 2.5, 0.52)
    ], 0.012);
}

// === WHISKERS ===
const whiskerMat = new THREE.LineBasicMaterial({ color: 0x444444 });

function whisker(pts) {
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(16));
    return new THREE.Line(geo, whiskerMat);
}

for (let side = -1; side <= 1; side += 2) {
    cat.add(whisker([
        new THREE.Vector3(side * 0.14, 1.72, 1.22),
        new THREE.Vector3(side * 0.4, 1.78, 1.3),
        new THREE.Vector3(side * 0.65, 1.82, 1.22)
    ]));
    cat.add(whisker([
        new THREE.Vector3(side * 0.14, 1.69, 1.22),
        new THREE.Vector3(side * 0.4, 1.69, 1.32),
        new THREE.Vector3(side * 0.65, 1.68, 1.25)
    ]));
    cat.add(whisker([
        new THREE.Vector3(side * 0.14, 1.66, 1.22),
        new THREE.Vector3(side * 0.4, 1.6, 1.3),
        new THREE.Vector3(side * 0.65, 1.55, 1.22)
    ]));
}

// === TAIL - Curved up ===
const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.0, -0.85),
    new THREE.Vector3(0, 1.2, -1.15),
    new THREE.Vector3(0.1, 1.55, -1.2),
    new THREE.Vector3(0.15, 1.9, -1.05),
    new THREE.Vector3(0.1, 2.1, -0.85)
]);

const tailGeo = new THREE.TubeGeometry(tailCurve, 32, 0.09, 16, false);
const tail = new THREE.Mesh(tailGeo, furGray);
tail.castShadow = true;
cat.add(tail);

// Tail tip
const tipCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.1, 2.1, -0.85),
    new THREE.Vector3(0.05, 2.2, -0.7)
]);
const tipGeo = new THREE.TubeGeometry(tipCurve, 12, 0.085, 16, false);
cat.add(new THREE.Mesh(tipGeo, furDark));

// Tail stripes
for (let i = 0; i < 4; i++) {
    const t = 0.12 + i * 0.2;
    const pt = tailCurve.getPoint(t);
    const tan = tailCurve.getTangent(t);

    const stripeGeo = new THREE.TorusGeometry(0.11 - i * 0.008, 0.022, 8, 24);
    const stripe = new THREE.Mesh(stripeGeo, furDark);
    stripe.position.copy(pt);
    stripe.lookAt(pt.clone().add(tan));
    cat.add(stripe);
}

scene.add(cat);

// === GROUND ===
const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshToonMaterial({ color: 0x7ec850 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// === ANIMATION ===
let time = 0;
const leftEarOrigZ = leftEar.rotation.z;
const rightEarOrigZ = rightEar.rotation.z;

function animate() {
    requestAnimationFrame(animate);
    time += 0.016;

    // Breathing
    const breathe = Math.sin(time * 2) * 0.012;
    body.scale.y = 0.6 + breathe;

    // Tail sway
    tail.rotation.z = Math.sin(time * 0.8) * 0.12;
    tail.rotation.x = Math.sin(time * 0.6) * 0.04;

    // Ear twitch
    const twitch = Math.sin(time * 5) > 0.95 ? Math.sin(time * 25) * 0.1 : 0;
    leftEar.rotation.z = leftEarOrigZ + twitch;
    rightEar.rotation.z = rightEarOrigZ - twitch;

    // Blink
    const blinkCycle = time % 4.5;
    let blink = 1;
    if (blinkCycle > 4.2) {
        blink = Math.cos((blinkCycle - 4.2) * Math.PI / 0.3) * 0.5 + 0.5;
    }

    cat.children.forEach(child => {
        if (child.geometry && child.geometry.type === 'SphereGeometry') {
            const p = child.position;
            if (p.z > 1.14 && p.z < 1.35 && p.y > 1.85 && p.y < 1.95 && Math.abs(p.x) > 0.1 && Math.abs(p.x) < 0.25) {
                if (child.material === whiteMat || child.material === irisColor || child.material === blackMat) {
                    const baseScale = child.geometry.parameters.radius > 0.1 ? 1.1 : 1;
                    child.scale.y = blink * baseScale;
                }
            }
        }
    });

    // Subtle body sway
    cat.rotation.y = Math.sin(time * 0.3) * 0.02;

    // Head tilt
    head.rotation.z = Math.sin(time * 0.5) * 0.02;
    head.rotation.y = Math.sin(time * 0.35) * 0.03;

    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
