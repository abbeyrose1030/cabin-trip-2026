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

