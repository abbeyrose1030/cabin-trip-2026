/* ═══════════════════════════════════════════════════════════
   CABIN TRIP 2026 — Scripts
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // Smooth page transitions
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
        // Only handle internal links
        if (link.hostname === window.location.hostname) {
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

if (raccoon) {
    const margin = 20;
    
    function scurryAround() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const raccoonW = 80;
        const raccoonH = 60;
        
        // Randomly choose top or bottom edge, always left to right
        const edge = Math.floor(Math.random() * 2);
        let startX, startY, endX, endY;
        
        if (edge === 0) {
            // Bottom: left to right
            startX = -raccoonW; startY = vh - margin - raccoonH;
            endX = vw + raccoonW; endY = vh - margin - raccoonH;
        } else {
            // Top: left to right
            startX = -raccoonW; startY = margin;
            endX = vw + raccoonW; endY = margin;
        }
        
        // Set initial position
        raccoon.style.left = startX + 'px';
        raccoon.style.top = startY + 'px';
        
        // Show and start running
        raccoon.classList.add('active', 'running');
        
        // Animate across
        const duration = 10000 + Math.random() * 4000;
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing
            const eased = progress;
            
            const currentX = startX + (endX - startX) * eased;
            const currentY = startY + (endY - startY) * eased;
            
            raccoon.style.left = currentX + 'px';
            raccoon.style.top = currentY + 'px';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                raccoon.classList.remove('active', 'running');
                // Schedule next appearance
                scheduleNextScurry();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    function scheduleNextScurry() {
        // Random interval between 15-45 seconds
        const delay = 15000 + Math.random() * 30000;
        setTimeout(scurryAround, delay);
    }
    
    // First appearance right away
    scurryAround();
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

