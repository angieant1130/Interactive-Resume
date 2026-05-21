// ── Tab data ──────────────────────────────────────────
const TABS = [
    { id: 'tab-resume',     label: 'Resume'      },
    { id: 'tab-experience', label: 'Classroom Experience'  },
    { id: 'tab-about',      label: 'About Me'    },
    { id: 'tab-gallery',    label: 'Gallery'     },
    { id: 'tab-funfacts',   label: 'Fun Facts'   },
];

let currentTab = 0;
let isAnimating = false;

// ── Render the active tab with slide direction ─────────
function renderTab(index, direction = 1) {
    // prevent spamming arrows during animation
    if (isAnimating) return;

    // wrap around
    if (index < 0) index = TABS.length - 1;
    if (index >= TABS.length) index = 0;

    // no-op if same tab
    if (index === currentTab) return;

    isAnimating = true;

    const prevIndex  = currentTab;
    currentTab       = index;

    const outgoingEl = document.getElementById(TABS[prevIndex].id);
    const incomingEl = document.getElementById(TABS[currentTab].id);

    // pick slide classes based on direction
    const slideOutClass = direction > 0 ? 'slide-out-left'  : 'slide-out-right';
    const slideInClass  = direction > 0 ? 'slide-in-right'  : 'slide-in-left';

    // update label and dots immediately
    document.getElementById('tab-label').textContent = TABS[currentTab].label;
    document.querySelectorAll('.tab-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentTab);
    });

    // animate outgoing panel out
    outgoingEl.classList.add(slideOutClass);

    outgoingEl.addEventListener('animationend', () => {
        // hide outgoing
        outgoingEl.classList.remove('active', slideOutClass);

        // show and animate incoming panel in
        incomingEl.classList.add('active', slideInClass);

        incomingEl.addEventListener('animationend', () => {
            incomingEl.classList.remove(slideInClass);
            isAnimating = false;
            resize(); // recalculate canvas height for new tab content
        }, { once: true });

    }, { once: true });

    // scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Arrow buttons ──────────────────────────────────────
function shiftTab(direction) {
    renderTab(currentTab + direction, direction);
}

// ── Dot clicks ─────────────────────────────────────────
function goToTab(index) {
    const direction = index >= currentTab ? 1 : -1;
    renderTab(index, direction);
}

// ── Init on page load ──────────────────────────────────
renderTab(0);

// ── Fun Facts banner color cycler ─────────────────────
const PASTEL_COLORS = [
    '#CECBF6', // lavender
    '#F4C0D1', // pink
    '#9FE1CB', // mint
    '#FAC775', // amber
    '#B5E4FA', // sky blue
    '#F9C9F9', // lilac
    '#C3F0A2', // lime
    '#FDDBA0', // peach
];

function cycleBannerColors() {
    const letters = document.querySelectorAll('.banner-letter');
    letters.forEach((letter, i) => {
        const colorIndex = (Math.floor(Date.now() / 300) + i) % PASTEL_COLORS.length;
        letter.style.color = PASTEL_COLORS[colorIndex];
    });
}

setInterval(cycleBannerColors, 300);
cycleBannerColors();

// ── Snake background animation ─────────────────────────
(function () {
    const canvas = document.getElementById('snake-canvas');
    const ctx    = canvas.getContext('2d');

    const SNAKE_COLORS = [
        'rgba(206, 203, 246, 0.9)', // lavender
        'rgba(244, 192, 209, 0.9)', // pink
        'rgba(159, 225, 203, 0.9)', // mint
        'rgba(250, 199, 117, 0.9)', // amber
        'rgba(181, 228, 250, 0.9)', // sky blue
        'rgba(249, 201, 249, 0.9)', // lilac
        'rgba(195, 240, 162, 0.9)', // lime
    ];

    let snakes = [];

    function resize() {
        const newHeight = Math.max(document.body.scrollHeight, window.innerHeight);
        
        // only reinitialize snakes if the height changed significantly
        const heightChanged = Math.abs(canvas.height - newHeight) > 50;
        
        canvas.width  = window.innerWidth;
        canvas.height = newHeight;
        
        if (heightChanged) {
            initSnakes();
        }
    }

    function initSnakes() {
        snakes = [];
        const count = Math.floor(canvas.height / 120); // one snake per ~120px of height
        for (let i = 0; i < count; i++) {
            snakes.push(makeSnake(i, count));
        }
    }

    function makeSnake(i, count, randomStart = false) {
        const laneH = canvas.height / count;
        return {
            // vertical center of this snake's lane
            y:         laneH * i + laneH / 2,
            // how far along the x axis the wave origin is
            offsetX:   randomStart ? -Math.random() * canvas.width : -canvas.width * (0.2 + Math.random() * 1.2),
            amplitude: 18 + Math.random() * 22,   // wave height (px)
            wavelength: 120 + Math.random() * 100, // wave width (px)
            speed:     1 + Math.random() * 0.6,  // px per frame
            thickness: 6 + Math.random() * 6,      // line width
            length:    canvas.width * (0.25 + Math.random() * 0.35), // how long the snake is
            color:     SNAKE_COLORS[i % SNAKE_COLORS.length],
        };
    }

    function drawSnake(s) {
        const startX = s.offsetX;
        const endX   = s.offsetX + s.length;

        // skip if entirely off screen
        if (endX < 0 || startX > canvas.width) return;

        const step = 4;
        const points = [];

        // build the full set of points first
        for (let x = startX; x <= endX; x += step) {
            const y = s.y + Math.sin((x / s.wavelength) * Math.PI * 2) * s.amplitude;
            points.push({ x, y });
        }

        if (points.length < 2) return;

        // create a linear gradient from the head to the tail along x
        const base = s.color.match(/[\d.]+/g);
        const r = base[0], g = base[1], b = base[2], a = parseFloat(base[3]);

        const grad = ctx.createLinearGradient(startX, 0, endX, 0);
        grad.addColorStop(0,    `rgba(${r},${g},${b},0)`);
        grad.addColorStop(0.04, `rgba(${r},${g},${b},${a})`);
        grad.addColorStop(0.96, `rgba(${r},${g},${b},${a})`);
        grad.addColorStop(1,    `rgba(${r},${g},${b},0)`);

        // draw the snake as one single continuous path
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }

        ctx.lineWidth   = s.thickness;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.strokeStyle = grad;
        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snakes.forEach((s, i) => {
            s.offsetX += s.speed;
            drawSnake(s);

            // reset once the tail has passed the right edge
            if (s.offsetX > canvas.width) {
                snakes[i] = makeSnake(i, snakes.length, true);
                snakes[i].offsetX = -snakes[i].length; // start from off-screen left
            }
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('load', () => {
        setTimeout(resize, 100);
        animate();
    });
})();