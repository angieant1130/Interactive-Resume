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