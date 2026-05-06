// ── Tab data ──────────────────────────────────────────
const TABS = [
    { id: 'tab-resume',     label: 'Resume'      },
    { id: 'tab-experience', label: 'Experience'  },
    { id: 'tab-about',      label: 'About Me'    },
    { id: 'tab-gallery',    label: 'Gallery'     },
    { id: 'tab-funfacts',   label: 'Fun Facts'   },
];

let currentTab = 0;

// ── Render the active tab ──────────────────────────────
function renderTab(index) {
    // clamp
    if (index < 0) index = TABS.length - 1;
    if (index >= TABS.length) index = 0;
    currentTab = index;

    // hide all panels
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

    // show active panel
    document.getElementById(TABS[currentTab].id).classList.add('active');

    // update label
    document.getElementById('tab-label').textContent = TABS[currentTab].label;

    // update dots
    document.querySelectorAll('.tab-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentTab);
    });

    // scroll to top of content smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Arrow buttons ──────────────────────────────────────
function shiftTab(direction) {
    renderTab(currentTab + direction);
}

// ── Dot click ─────────────────────────────────────────
function goToTab(index) {
    renderTab(index);
}

// ── Init ──────────────────────────────────────────────
renderTab(0);

// ── Fun Facts banner color cycler ──────────────────────
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
        const colorIndex = (Math.floor(Date.now() / 1000) + i) % PASTEL_COLORS.length;
        letter.style.color = PASTEL_COLORS[colorIndex];
    });
}

// start cycling once DOM is ready
setInterval(cycleBannerColors, 250);
cycleBannerColors(); // run immediately so there's no blank flash