/* ═══════════════════════════════════════════════════════════
   CABIN TRIP 2026 — Countdown Timer
   ═══════════════════════════════════════════════════════════ */

function updateCountdown() {
    const countdownDisplay = document.getElementById('countdownDisplay');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // Safety check - elements may not exist if script runs before DOM is ready
    if (!countdownDisplay || !daysEl || !hoursEl || !minutesEl || !secondsEl) {
        return;
    }
    
    // Trip date: January 2, 2026 at 3:00 PM (adjust time as needed)
    const tripDate = new Date('2026-01-02T15:00:00').getTime();
    const now = new Date().getTime();
    const distance = tripDate - now;

    if (distance < 0) {
        countdownDisplay.innerHTML = '<p class="countdown-finished">🎉 THE TRIP IS HERE! 🎉</p>';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
}

// Initialize countdown when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Update countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
});

