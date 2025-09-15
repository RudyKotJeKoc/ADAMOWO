// app.js

// Player functionality
const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause');
const progress = document.getElementById('progress');

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="4" height="16" x="6" y="4"></rect><rect width="4" height="16" x="14" y="4"></rect></svg>'; // Pause icon
    } else {
        audio.pause();
        playPauseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>'; // Play icon
    }
});

audio.addEventListener('timeupdate', () => {
    progress.value = (audio.currentTime / audio.duration) * 100;
});

progress.addEventListener('input', () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});

// Calendar functionality
const calendar = document.querySelector('#calendar .grid-cols-7');
const monthYear = document.getElementById('month-year');
const prevMonth = document.getElementById('prev-month');
const nextMonth = document.getElementById('next-month');

let currentDate = new Date();

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

    // Clear days
    while (calendar.children.length > 7) {
        calendar.removeChild(calendar.lastChild);
    }

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add blank days
    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement('div');
        calendar.appendChild(blank);
    }

    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElem = document.createElement('div');
        dayElem.textContent = day;
        dayElem.classList.add('cursor-pointer', 'hover:bg-accent-weak', 'hover:text-black', 'rounded-full', 'transition');
        if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            dayElem.classList.add('ring-2', 'ring-accent');
        }
        dayElem.addEventListener('click', () => {
            // Placeholder for opening entry
            alert(`Wybrano dzień: ${day}`);
        });
        calendar.appendChild(dayElem);
    }
}

prevMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();

// Chat simulator
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

// Dummy AI responses
const aiResponses = [
    'Czy naprawdę myślisz, że to moja wina?',
    'Ale przecież zawsze robię to dla twojego dobra.',
    'Nie przesadzaj, to tylko żart.',
    'Bez ciebie jestem niczym, nie opuszczaj mnie.',
    'To ty jesteś problemem, nie ja.'
];

function appendMessage(role, text) {
    const message = document.createElement('div');
    message.classList.add('p-3', 'rounded-xl', role === 'Ty' ? 'bg-panel-2' : 'bg-black/20', 'text-slate-200');
    message.innerHTML = `<strong>${role}:</strong> ${text}`;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatSend.addEventListener('click', () => {
    const userText = chatInput.value.trim();
    if (userText) {
        appendMessage('Ty', userText);
        chatInput.value = '';
        // Simulate AI response after delay
        setTimeout(() => {
            const aiText = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            appendMessage('Manipulator (AI)', aiText);
        }, 1000);
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        chatSend.click();
    }
});

// Accordion functionality (using <details> native, no JS needed unless custom)