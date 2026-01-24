document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggling
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Check local storage or system preference
    const currentTheme = localStorage.getItem('theme') ||
        (prefersDarkScheme.matches ? 'dark' : 'light');

    // Apply initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const existingTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = existingTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        // Simple SVG switch logic could go here, for now relying on CSS styling hooks if needed
        // or swapping innerHTML of the button
        const icon = theme === 'dark'
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

        themeToggle.innerHTML = icon;
    }

    // Scroll Animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Fade up elements
    const fadeElements = document.querySelectorAll('.feature-card, .faq-item');
    fadeElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// Mobile Menu Toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}



// Smart Navbar (Hide on Scroll Down, Show on Scroll Up)
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Downscroll & past threshold
            navbar.classList.add('navbar-hidden');
        } else {
            // Upscroll
            navbar.classList.remove('navbar-hidden');
        }
        lastScrollTop = Math.max(scrollTop, 0);
    }, { passive: true });
}

// Metride Hero Animation Controller
// Handles the 8-second loop: Chaos -> Processing -> Live -> Calm

document.addEventListener('DOMContentLoaded', () => {
    const sceneConfusion = document.getElementById('scene-confusion');
    const sceneProcessing = document.getElementById('scene-processing');
    const sceneLive = document.getElementById('scene-live');
    const sceneFinal = document.getElementById('scene-final');

    // Guard clause: If hero animation elements are missing (e.g. on help.html), stop this specific block.
    if (!sceneConfusion || !sceneProcessing || !sceneLive || !sceneFinal) {
        return; // Safely exit the animation controller logic, allowing other listeners to run if they were outside.
        // Wait, the Navbar logic IS technically inside this block if lines 213-226 are within the same event listener.
        // Checking the file structure from earlier view_file output:
        // Line 81: document.addEventListener...
        // Line 216: window.addEventListener('scroll'... inside line 81 block?
        // Let's check lines 212-230.
        // Yes, the Navbar logic IS inside the DOMContentLoaded block from line 81.
        // So 'return' here STOPS the Navbar logic from being registered too!

        // CORRECTION: I must move the Navbar logic OUTSIDE this block or BEFORE the return.
        // Or I should put the animation logic in its own function and call it safely.
    }

    // Elements to animate individually
    const cleanRoute = document.getElementById('clean-route');
    const badge = document.getElementById('fastest-badge');
    const ripples = document.querySelectorAll('.ripple, .ripple-delayed');
    const movingTrain = document.getElementById('moving-train');
    const nextStopCard = document.getElementById('next-stop-card');
    const alarmIcon = document.getElementById('alarm-icon');

    // Timing Constants (ms)
    const T_PROCESS = 2000; // 2s
    const T_LIVE = 3500;    // 3.5s
    const T_CALM = 5500;    // 5.5s
    const T_LOOP = 8000;    // 8s

    function resetAnimation() {
        // Reset to initial state (Confusion visible, others hidden)

        // 1. Show Confusion
        sceneConfusion.style.opacity = '1';

        // 2. Hide others
        sceneProcessing.style.opacity = '0';
        sceneLive.style.opacity = '0';
        sceneFinal.style.opacity = '0';

        // 3. Reset CSS animations by removing/re-adding classes or resetting styles
        // We use a small reflow hack or just clear headers
        cleanRoute.style.animation = 'none';
        badge.style.animation = 'none';
        ripples.forEach(r => r.style.animation = 'none');

        // Train reset
        // For SVG SMIL animations (animate tag), we reload it or rely on time
        const trainAnim = movingTrain.querySelector('animate');
        if (trainAnim) {
            trainAnim.beginElement(); // Restart SVG native animation
        }

        nextStopCard.style.animation = 'none';
        alarmIcon.style.animation = 'none';
    }

    function startLoop() {
        resetAnimation();

        // SCENE 2: Processing (Start at 2s)
        setTimeout(() => {
            sceneConfusion.style.opacity = '0'; // Fade out chaos
            sceneProcessing.style.opacity = '1'; // Show processing

            // Trigger CSS animations
            cleanRoute.style.animation = 'drawRoute 1.5s ease-out forwards';
            ripples.forEach((r, i) => {
                r.style.animation = `rippleExpand 1.5s ease-out ${i * 0.2}s forwards`;
            });
            badge.style.animation = 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.8s forwards';

        }, T_PROCESS);

        // SCENE 3: Live Journey (Start at 3.5s)
        setTimeout(() => {
            // Keep processing visible (route map) but maybe overlay live elements
            // Or fade processing items except the route
            badge.style.opacity = '0'; // Hide badge to clean up

            sceneLive.style.opacity = '1';

            // Train animation is handled by <animate> tag starting at 3.5s automatically relative to document load?
            // Actually SMIL 'begin' attribute is absolute. We need to control it or use JS.
            // Let's rely on the CSS/JS hybrid for better control.
            // Re-triggering SMIL in resetAnimation handles the timing if we sync loop.
            // But strict 8s loop means we might drift. simple CSS animation on the train might be safer.
            // Let's stick to the plan:

            nextStopCard.style.animation = 'slideUpFade 0.6s ease-out forwards';

            setTimeout(() => {
                alarmIcon.style.animation = 'alarmPopShake 0.6s ease-out forwards';
            }, 1000); // Alarm 1s into the live scene (4.5s total)

        }, T_LIVE);

        // SCENE 4: Final / Calm (Start at 5.5s)
        setTimeout(() => {
            sceneLive.style.opacity = '0'; // Fade out live UI
            sceneProcessing.style.opacity = '0'; // Fade out route line if wanted, or keep it

            sceneFinal.style.opacity = '1';
            sceneFinal.classList.add('final-breath');
        }, T_CALM);
    }

    // Start immediately
    startLoop();

    // Loop every 8 seconds
    setInterval(startLoop, T_LOOP);

    // Scroll Journey Tracker Logic
    const track = document.querySelector('.metro-track');
    const train = document.getElementById('metro-train');
    const popup = document.getElementById('station-popup');
    const popupText = document.getElementById('popup-text');

    // Define sections to track
    const sections = [
        { id: 'hero', name: 'Start' },
        { id: 'problems', name: 'Struggle' },
        { id: 'solutions', name: 'Solution' },
        { id: 'features', name: 'Features' },
        { id: 'cta', name: 'Download' }
    ];

    // Assign IDs to sections if they don't have them (for robust tracking)
    // Note: In a real app, IDs should be in HTML. Here we patch them for the demo.
    const sectionElements = document.querySelectorAll('section');
    sectionElements.forEach((sec, index) => {
        if (!sec.id && index < sections.length) {
            sec.id = sections[index].id;
        } else if (index < sections.length) {
            // Ensure mapping if IDs differ
            sections[index].id = sec.id;
        }
    });

    // Smart Navbar (Hide on Scroll Down, Show on Scroll Up)
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');



    if (track && train && popup) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const trackHeight = track.offsetHeight;

            // Calculate progress (0 to 1)
            // We want the train to travel the full track height relative to scrollable area
            const maxScroll = docHeight - windowHeight;
            const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

            // Move train
            const trainPos = progress * (trackHeight - 40); // 40 is height of train icon
            train.style.top = `${trainPos}px`;

            // Section Detection
            let currentSectionName = '';
            let activeFound = false;

            // Check which section is in the middle of the viewport
            const triggerPoint = scrollY + (windowHeight / 2);

            document.querySelectorAll('section').forEach((sec, index) => {
                const rect = sec.getBoundingClientRect();
                const absoluteTop = rect.top + scrollY;
                const absoluteBottom = absoluteTop + rect.height;

                if (triggerPoint >= absoluteTop && triggerPoint < absoluteBottom) {
                    // We are in this section
                    // Map generic section index to our specific names if possible
                    if (index === 0) currentSectionName = 'Home';
                    else if (sec.querySelector('.problem-card')) currentSectionName = 'Metro Struggle';
                    else if (sec.querySelector('.feature-split')) currentSectionName = 'Metride Solution';
                    else if (sec.querySelector('.features-grid')) currentSectionName = 'Features';
                    else if (sec.querySelector('h2').innerText.includes('Ready')) currentSectionName = 'Get App';
                    else currentSectionName = 'Metride Simplifies';

                    activeFound = true;
                }
            });

            if (activeFound && currentSectionName) {
                // Update Popup
                if (popupText.innerText !== currentSectionName) {
                    popupText.innerText = currentSectionName;
                    popup.classList.add('visible');

                    // Auto-hide after 2 seconds to not annoy, or keep visible? 
                    // Let's keep visible while scrolling, hide if idle? 
                    // Requirement: "show an popup on metro icon side and say you are at..."

                    clearTimeout(popup.hideTimeout);
                    popup.hideTimeout = setTimeout(() => {
                        popup.classList.remove('visible');
                    }, 2000);
                } else if (!popup.classList.contains('visible')) {
                    popup.classList.add('visible');
                    clearTimeout(popup.hideTimeout);
                    popup.hideTimeout = setTimeout(() => {
                        popup.classList.remove('visible');
                    }, 2000);
                }
            }
        });
    }

});

// Battery Guide Modal Logic (Safe Scope)
const batteryBtn = document.getElementById('battery-guide-btn');
const batteryModal = document.getElementById('battery-modal');
const modalCloseBtns = document.querySelectorAll('.modal-close, .modal-action-close');

if (batteryBtn && batteryModal) {
    // Open Modal
    batteryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        batteryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close Modal (Buttons)
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            batteryModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close Modal (Click Outside)
    batteryModal.addEventListener('click', (e) => {
        if (e.target === batteryModal) {
            batteryModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close Modal (Escape Key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && batteryModal.classList.contains('active')) {
            batteryModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}
