/**
 * ROMANTIC PROPOSAL WEBSITE - INTERACTIVE LOGIC
 * Features: GSAP Animations, Particles.js, Confetti, Runaway Button
 */

// ============================================
// GLOBAL VARIABLES & CONFIGURATION
// ============================================
const CONFIG = {
    particles: {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: ['#ec4899', '#f43f5e', '#9333ea', '#f472b6', '#fb7185'] },
            shape: { type: ['circle', 'heart'] },
            opacity: { value: 0.6, random: true },
            size: { value: 4, random: { enable: true, minimum_value: 2, maximum_value: 8 } },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ec4899',
                opacity: 0.3,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            },
            modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    },
    noButton: {
        minScale: 0.3,
        shrinkFactor: 0.85,
        maxClicks: 6,
        moveDistance: 100
    }
};

// State management
let state = {
    noButtonClicks: 0,
    noButtonScale: 1,
    isMusicPlaying: false,
    hasOpened: false
};

// DOM Elements
const elements = {
    curtain: document.getElementById('curtain'),
    openBtn: document.getElementById('openBtn'),
    mainContent: document.getElementById('mainContent'),
    proposalCard: document.querySelector('.proposal-card'),
    messageLines: document.querySelectorAll('.message-line'),
    yesBtn: document.getElementById('yesBtn'),
    noBtn: document.getElementById('noBtn'),
    celebrationOverlay: document.getElementById('celebrationOverlay'),
    closeCelebration: document.getElementById('closeCelebration'),
    bgMusic: document.getElementById('bgMusic'),
    envelope: document.querySelector('.envelope')
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initEventListeners();
    initAnimations();
});

// Initialize Particles.js background
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', CONFIG.particles);
    }
}

// Initialize all event listeners
function initEventListeners() {
    // Open button - reveal main content
    elements.openBtn.addEventListener('click', handleCurtainOpen);
    
    // Yes button - trigger celebration
    elements.yesBtn.addEventListener('click', handleYesClick);
    
    // No button - shrink or run away
    elements.noBtn.addEventListener('click', handleNoClick);
    elements.noBtn.addEventListener('mouseenter', handleNoHover);
    
    // Close celebration overlay
    elements.closeCelebration.addEventListener('click', () => {
        gsap.to(elements.celebrationOverlay, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                elements.celebrationOverlay.classList.remove('active');
                elements.celebrationOverlay.style.display = 'none';
            }
        });
    });
    
    // Handle window resize for responsive behavior
    window.addEventListener('resize', handleResize);
}

// Initialize GSAP animations
function initAnimations() {
    // Set initial states
    gsap.set(elements.mainContent, { autoAlpha: 0 });
    gsap.set(elements.proposalCard, { y: 50, opacity: 0 });
    gsap.set(elements.messageLines, { y: 20, opacity: 0 });
    
    // Envelope floating animation enhancement
    gsap.to('.envelope', {
        y: -10,
        duration: 2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
    });
    
    // Heartbeat pulse
    gsap.to('.heart', {
        scale: 1.1,
        duration: 0.8,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
    });
}

// ============================================
// CURTAIN / ENVELOPE OPENING
// ============================================
function handleCurtainOpen() {
    if (state.hasOpened) return;
    state.hasOpened = true;
    
    // Play background music
    playBackgroundMusic();
    
    // Open envelope animation
    elements.envelope.classList.add('open');
    
    // Create timeline for curtain reveal
    const tl = gsap.timeline();
    
    // Animate envelope opening
    tl.to('.envelope-flap', {
        rotationX: 180,
        duration: 0.6,
        ease: 'power2.out'
    })
    .to('.heart', {
        scale: 1.5,
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'back.in(1.7)'
    }, '-=0.3')
    .to(elements.openBtn, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'back.in(1.7)'
    }, '-=0.6')
    .to(elements.curtain, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1,
        ease: 'power4.inOut'
    }, '-=0.2')
    .set(elements.mainContent, { 
        display: 'flex',
        autoAlpha: 1 
    })
    .to(elements.proposalCard, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.3')
    .add(() => {
        animateMessageLines();
    }, '-=0.4');
}

// Animate message lines with stagger
function animateMessageLines() {
    elements.messageLines.forEach((line, index) => {
        const delay = parseFloat(line.dataset.delay) || (index * 0.8);
        
        gsap.to(line, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: delay,
            ease: 'power3.out'
        });
    });
    
    // Animate buttons after messages
    gsap.from([elements.yesBtn, elements.noBtn], {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        delay: 3.5,
        ease: 'back.out(1.7)'
    });
}

// ============================================
// BACKGROUND MUSIC
// ============================================
function playBackgroundMusic() {
    if (elements.bgMusic && !state.isMusicPlaying) {
        elements.bgMusic.volume = 0.4; // Set to 40% volume
        
        const playPromise = elements.bgMusic.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    state.isMusicPlaying = true;
                    console.log('Background music started');
                })
                .catch(error => {
                    console.log('Audio playback failed (user interaction needed first):', error);
                    // Try again on next user interaction
                    document.addEventListener('click', function tryPlay() {
                        elements.bgMusic.play().then(() => {
                            state.isMusicPlaying = true;
                            document.removeEventListener('click', tryPlay);
                        }).catch(() => {});
                    }, { once: true });
                });
        }
    }
}

// ============================================
// YES BUTTON - CELEBRATION
// ============================================
function handleYesClick() {
    // Trigger confetti explosion
    triggerConfetti();
    
    // Show celebration overlay
    showCelebration();
    
    // Animate yes button
    gsap.to(elements.yesBtn, {
        scale: 1.3,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
    });
    
    // Hide no button if visible
    gsap.to(elements.noBtn, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'back.in(1.7)'
    });
}

// Trigger massive confetti explosion
function triggerConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;
    
    // First burst - center
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f43f5e', '#9333ea', '#f472b6', '#fb7185', '#ffffff'],
        shapes: ['circle', 'square'],
        scalar: 1.2
    });
    
    // Continuous bursts
    const interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval);
            return;
        }
        
        // Left side burst
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 },
            colors: ['#ec4899', '#f43f5e', '#9333ea', '#f472b6']
        });
        
        // Right side burst
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 },
            colors: ['#ec4899', '#f43f5e', '#9333ea', '#f472b6']
        });
        
        // Random bursts from top
        confetti({
            particleCount: 30,
            spread: 80,
            origin: { 
                x: Math.random(), 
                y: Math.random() * 0.3 
            },
            colors: ['#ec4899', '#f43f5e', '#9333ea', '#ffffff'],
            shapes: ['circle', 'heart']
        });
    }, 250);
    
    // Final big burst
    setTimeout(() => {
        confetti({
            particleCount: 200,
            spread: 150,
            origin: { y: 0.5 },
            colors: ['#ec4899', '#f43f5e', '#9333ea', '#f472b6', '#fb7185', '#ffffff', '#ffd700'],
            shapes: ['circle', 'square', 'heart'],
            scalar: 1.5,
            drift: 0,
            gravity: 0.8
        });
    }, 1500);
}

// Show celebration overlay
function showCelebration() {
    elements.celebrationOverlay.style.display = 'flex';
    
    // Small delay to allow display:flex to apply
    setTimeout(() => {
        elements.celebrationOverlay.classList.add('active');
    }, 10);
    
    // Animate celebration hearts
    gsap.from('.celebration-heart', {
        scale: 0,
        rotation: 360,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        delay: 0.3
    });
}

// ============================================
// NO BUTTON - SHRINKING / RUNAWAY EFFECT
// ============================================
function handleNoClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    state.noButtonClicks++;
    
    // Calculate new scale
    const newScale = Math.pow(CONFIG.noButton.shrinkFactor, state.noButtonClicks);
    
    // Check if button should disappear
    if (newScale <= CONFIG.noButton.minScale || state.noButtonClicks >= CONFIG.noButton.maxClicks) {
        // Make button disappear completely
        gsap.to(elements.noBtn, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: 'back.in(1.7)',
            onComplete: () => {
                elements.noBtn.style.display = 'none';
                
                // Make yes button pulse to draw attention
                gsap.to(elements.yesBtn, {
                    scale: 1.2,
                    duration: 0.5,
                    yoyo: true,
                    repeat: 5,
                    ease: 'power1.inOut'
                });
            }
        });
        
        // Show playful message
        showPlayfulMessage('Looks like you have no choice now! 😏');
    } else {
        // Shrink the button
        state.noButtonScale = newScale;
        
        gsap.to(elements.noBtn, {
            scale: newScale,
            duration: 0.4,
            ease: 'power2.out'
        });
        
        // Add shake effect
        elements.noBtn.classList.add('shrinking');
        setTimeout(() => {
            elements.noBtn.classList.remove('shrinking');
        }, 500);
        
        // Show playful messages based on click count
        const messages = [
            'Are you sure? 🤔',
            'Think again! 💭',
            'Really? 😢',
            'Come on! 🥺',
            'Last chance! ⚠️',
            'Okay, fine! 😤'
        ];
        
        if (state.noButtonClicks <= messages.length) {
            showPlayfulMessage(messages[state.noButtonClicks - 1]);
        }
    }
}

// Handle hover - make button run away on desktop
function handleNoHover(e) {
    // Only run away on larger screens and if button is still visible
    if (window.innerWidth > 640 && state.noButtonScale > 0.5) {
        const rect = elements.noBtn.getBoundingClientRect();
        const containerRect = elements.noBtn.parentElement.getBoundingClientRect();
        
        // Calculate random position within container bounds
        const maxX = containerRect.width - rect.width;
        const maxY = containerRect.height - rect.height;
        
        const randomX = Math.random() * maxX - (rect.left - containerRect.left);
        const randomY = Math.random() * maxY - (rect.top - containerRect.top);
        
        // Move button
        gsap.to(elements.noBtn, {
            x: `+=${randomX * 0.5}`,
            y: `+=${randomY * 0.5}`,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
}

// Show playful floating message
function showPlayfulMessage(text) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.playful-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const message = document.createElement('div');
    message.className = 'playful-message';
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ec4899, #f43f5e);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(236, 72, 153, 0.4);
        z-index: 100;
        opacity: 0;
        pointer-events: none;
    `;
    
    document.body.appendChild(message);
    
    // Animate in
    gsap.to(message, {
        opacity: 1,
        y: -10,
        duration: 0.4,
        ease: 'power2.out'
    });
    
    // Animate out after delay
    gsap.to(message, {
        opacity: 0,
        y: -30,
        duration: 0.4,
        delay: 2,
        ease: 'power2.in',
        onComplete: () => message.remove()
    });
}

// ============================================
// RESPONSIVE HANDLING
// ============================================
function handleResize() {
    // Reset no button position on resize
    if (elements.noBtn && elements.noBtn.style.display !== 'none') {
        gsap.set(elements.noBtn, { x: 0, y: 0 });
    }
    
    // Reinitialize particles for new screen size
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', CONFIG.particles);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Preload images for smoother experience
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const preloadImg = new Image();
            preloadImg.src = src;
        }
    });
}

// Call preload on load
window.addEventListener('load', preloadImages);

// Handle visibility change (pause/resume animations)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause expensive animations when tab is hidden
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});

// Add touch support for mobile
if ('ontouchstart' in window) {
    elements.noBtn.addEventListener('touchstart', handleNoClick, { passive: false });
}

// Console easter egg
console.log('%c💕 Will You Be Mine? 💕', 'font-size: 24px; font-weight: bold; color: #ec4899;');
console.log('%cA special proposal website created with love', 'font-size: 14px; color: #f43f5e;');
