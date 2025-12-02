/* ═══════════════════════════════════════════════════════════
   CABIN TRIP 2026 — Guest List
   ═══════════════════════════════════════════════════════════ */

const firebaseConfig = {
    apiKey: "AIzaSyD4npNgTmVh8TA6TdEbBQI8N6DC9EW4L9k",
    authDomain: "cabintrip2026.firebaseapp.com",
    databaseURL: "https://cabintrip2026-default-rtdb.firebaseio.com",
    projectId: "cabintrip2026",
    storageBucket: "cabintrip2026.firebasestorage.app",
    messagingSenderId: "867346528708",
    appId: "1:867346528708:web:f143bf898670bd0190cc91",
    measurementId: "G-VY5R64JWLH"
};

// Initialize Firebase
let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
} catch (e) {
    console.log('Firebase not configured yet');
}

const guestList = document.getElementById('guestList');
const emotions = [
    { value: 'excited', label: '🥳 excited' },
    { value: 'impatient', label: '😤 impatient' },
    { value: 'hungry', label: '🍕 hungry' },
    { value: 'outdoorsy', label: '🏕️ outdoorsy' }
];

// Guest list with fixed names (shuffled)
const guestNames = [
    'stevie', 'dalton', 'maddie', 'abby', 'gavin',
    'tyler', 'emily', 'mccall', 'kate', 'julia',
    'jenny', 'mikey', 'abbey', 'erika', 'alex',
    'paige', 'jamie', 'mike', 'dara', 'dalton c.'
];

const defaultGuests = guestNames.map((name, i) => ({
    id: `guest_${i + 1}`,
    name: name,
    feeling: ''
}));

// Initialize guest list
function initializeGuestList() {
    if (!db) {
        renderGuestList(defaultGuests);
        return;
    }

    const guestsRef = db.ref('guests');
    
    guestsRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            const guests = [];
            snapshot.forEach((child) => {
                const guestData = child.val();
                // Ensure name is set from our list
                const index = parseInt(child.key.replace('guest_', '')) - 1;
                const guest = {
                    id: child.key,
                    name: guestNames[index] || guestData.name || '',
                    feeling: guestData.feeling || ''
                };
                guests.push(guest);
                // Update name in Firebase if it's missing
                if (!guestData.name && guestNames[index]) {
                    guestsRef.child(child.key).update({ name: guestNames[index] });
                }
            });
            // Sort by ID to maintain order
            guests.sort((a, b) => {
                const aNum = parseInt(a.id.replace('guest_', ''));
                const bNum = parseInt(b.id.replace('guest_', ''));
                return aNum - bNum;
            });
            renderGuestList(guests);
        } else {
            // Initialize with default guests
            defaultGuests.forEach(guest => {
                guestsRef.child(guest.id).set({
                    name: guest.name,
                    feeling: ''
                });
            });
            renderGuestList(defaultGuests);
        }
    });
}

// Render the guest list
function renderGuestList(guests) {
    guestList.innerHTML = '';
    
    guests.forEach((guest) => {
        const li = document.createElement('li');
        li.className = 'guest-item';
        
        const nameDisplay = document.createElement('span');
        nameDisplay.className = 'guest-name-display';
        nameDisplay.textContent = guest.name || '';
        
        const feelingLabel = document.createElement('span');
        feelingLabel.className = 'feeling-label';
        feelingLabel.textContent = 'feeling:';
        
        const feelingSelect = document.createElement('select');
        feelingSelect.className = 'feeling-select';
        feelingSelect.id = `feeling_${guest.id}`;
        
        // Add empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '--';
        feelingSelect.appendChild(emptyOption);
        
        // Add emotion options
        emotions.forEach(emotion => {
            const option = document.createElement('option');
            option.value = emotion.value;
            option.textContent = emotion.label;
            if (guest.feeling === emotion.value) {
                option.selected = true;
            }
            feelingSelect.appendChild(option);
        });
        
        // Update feeling in Firebase
        feelingSelect.addEventListener('change', () => {
            if (db) {
                db.ref(`guests/${guest.id}`).update({ feeling: feelingSelect.value });
            }
        });
        
        li.appendChild(nameDisplay);
        li.appendChild(feelingLabel);
        li.appendChild(feelingSelect);
        guestList.appendChild(li);
    });
}

// Listen for real-time updates
if (db) {
    const guestsRef = db.ref('guests');
    guestsRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            const guests = [];
            snapshot.forEach((child) => {
                const guestData = child.val();
                const index = parseInt(child.key.replace('guest_', '')) - 1;
                const guest = {
                    id: child.key,
                    name: guestNames[index] || guestData.name || '',
                    feeling: guestData.feeling || ''
                };
                guests.push(guest);
            });
            guests.sort((a, b) => {
                const aNum = parseInt(a.id.replace('guest_', ''));
                const bNum = parseInt(b.id.replace('guest_', ''));
                return aNum - bNum;
            });
            renderGuestList(guests);
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeGuestList();
});

