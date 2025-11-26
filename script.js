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

