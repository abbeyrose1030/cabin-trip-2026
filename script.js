/* ═══════════════════════════════════════════════════════════
   CABIN TRIP 2026 — Scripts
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // Smooth page transitions
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
        // Only handle internal links (including file:// protocol for local dev)
        const isInternal = link.hostname === window.location.hostname || 
                          (!link.hostname && !window.location.hostname && 
                           link.protocol === 'file:' && window.location.protocol === 'file:');
        if (isInternal) {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Don't transition if it's the current page
                if (href === window.location.pathname.split('/').pop()) {
                    e.preventDefault();
                    return;
                }
                
                e.preventDefault();
                document.body.classList.add('fade-out');
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        }
    });

    // Subtle parallax on mouse move for home page
    const content = document.querySelector('.content');
    const trees = document.querySelector('.trees');
    
    if (content && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2) / window.innerWidth;
            const y = (e.clientY - window.innerHeight / 2) / window.innerHeight;
            
            content.style.transform = `translate(${x * 10}px, ${y * 5}px)`;
            
            if (trees) {
                trees.style.transform = `translate(${x * -15}px, ${y * -8}px)`;
            }
        });
    }

    // Add loaded class for any future use
    document.body.classList.add('loaded');
});

// Preserve scroll position for back/forward navigation
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'auto';
}

/* ═══════════════════════════════════════════════════════════
   RACCOON FRIEND
   ═══════════════════════════════════════════════════════════ */

const raccoon = document.getElementById('raccoon');

// Raccoon temporarily disabled
if (false && raccoon) {
    const margin = 20;
    let animationFrameId = null;
    let timeoutId = null;
    let isAnimating = false;
    
    function scurryAround() {
        // Prevent multiple animations
        if (isAnimating) return;
        
        // Clear any existing timeouts
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        
        // Cancel any existing animation
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        
        isAnimating = true;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const raccoonW = 80;
        const raccoonH = 60;
        
        // Randomly choose top or bottom edge, always left to right
        const edge = Math.floor(Math.random() * 2);
        let startX, startY, endX, endY;
        
        if (edge === 0) {
            // Bottom: left to right
            startX = -raccoonW;
            startY = vh - margin - raccoonH;
            endX = vw + raccoonW;
            endY = vh - margin - raccoonH;
        } else {
            // Top: left to right
            startX = -raccoonW;
            startY = margin;
            endX = vw + raccoonW;
            endY = margin;
        }
        
        // Set initial position (don't touch transform - let CSS animation handle waddle)
        raccoon.style.left = startX + 'px';
        raccoon.style.top = startY + 'px';
        
        // Show and start running
        raccoon.classList.add('active', 'running');
        
        // Animate across
        const duration = 10000 + Math.random() * 4000;
        const startTime = performance.now();
        
        function animate(currentTime) {
            if (!isAnimating) return; // Safety check
            
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Linear progress for smooth horizontal movement
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;
            
            // Only update left/top, let CSS transform handle the waddle
            raccoon.style.left = currentX + 'px';
            raccoon.style.top = currentY + 'px';
            
            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                // Animation complete
                raccoon.classList.remove('active', 'running');
                raccoon.style.left = '-200px';
                raccoon.style.top = '-200px';
                isAnimating = false;
                animationFrameId = null;
                // Schedule next appearance
                scheduleNextScurry();
            }
        }
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    function scheduleNextScurry() {
        // Random interval between 15-45 seconds
        const delay = 15000 + Math.random() * 30000;
        timeoutId = setTimeout(() => {
            timeoutId = null;
            scurryAround();
        }, delay);
    }
    
    // Wait for page to be fully loaded before starting
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(scurryAround, 1000);
        });
    } else {
        setTimeout(scurryAround, 1000);
    }
}

/* ═══════════════════════════════════════════════════════════
   SNOWFALL
   ═══════════════════════════════════════════════════════════ */

function createSnowfall() {
    // Adjust number of snowflakes based on screen size for performance
    const isMobile = window.innerWidth <= 768;
    const snowflakeCount = isMobile ? 42 : 70;
    
    const snowflakeChars = ['❄', '❅', '❆'];
    const sizes = ['snowflake-sm', 'snowflake-md', 'snowflake-lg'];
    
    for (let i = 0; i < snowflakeCount; i++) {
        createSnowflake();
    }
    
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        // Random snowflake character
        snowflake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
        
        // Random size
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        snowflake.classList.add(size);
        
        // Random horizontal position
        snowflake.style.left = Math.random() * 100 + '%';
        
        // Random animation duration (slower = more graceful)
        const duration = (Math.random() * 10 + 10) + 's';
        snowflake.style.animationDuration = duration;
        
        // Random delay for staggered start
        const delay = Math.random() * 10 + 's';
        snowflake.style.animationDelay = delay;
        
        // Add slight horizontal drift
        const drift = (Math.random() - 0.5) * 100;
        snowflake.style.setProperty('--drift', drift + 'px');
        
        document.body.appendChild(snowflake);
        
        // Remove and recreate after animation completes for continuous effect
        const totalDuration = parseFloat(duration) + parseFloat(delay);
        setTimeout(() => {
            snowflake.remove();
            createSnowflake();
        }, totalDuration * 1000);
    }
}

// Initialize snowfall on page load
document.addEventListener('DOMContentLoaded', () => {
    createSnowfall();
});

/* ═══════════════════════════════════════════════════════════
   CAMPFIRE MODE
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    const campfireToggle = document.getElementById('campfireToggle');
    const campfireGlow = document.getElementById('campfireGlow');
    
    if (campfireToggle && campfireGlow) {
        // Check if campfire mode was previously enabled
        const campfireEnabled = localStorage.getItem('campfireMode') === 'true';
        if (campfireEnabled) {
            campfireToggle.checked = true;
            campfireGlow.classList.add('active');
        }
        
        // Toggle campfire mode
        campfireToggle.addEventListener('change', () => {
            if (campfireToggle.checked) {
                campfireGlow.classList.add('active');
                localStorage.setItem('campfireMode', 'true');
            } else {
                campfireGlow.classList.remove('active');
                localStorage.setItem('campfireMode', 'false');
            }
        });
    }
});

